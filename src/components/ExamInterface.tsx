import { useState, useEffect } from 'react';
import { Clock, BookOpen, CheckCircle, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import type { Student, ExamResult } from '../App';
import { examData } from '../data/examData';

interface ExamInterfaceProps {
  student: Student;
  onComplete: (result: ExamResult) => void;
}

export function ExamInterface({ student, onComplete }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showStory, setShowStory] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const exam = student.category === 'primary' ? examData.primary : examData.highschool;
  const currentStorySet = exam.stories[Math.floor(currentQuestionIndex / exam.questionsPerStory)];
  const questionsInCurrentStory = exam.questions.slice(
    Math.floor(currentQuestionIndex / exam.questionsPerStory) * exam.questionsPerStory,
    (Math.floor(currentQuestionIndex / exam.questionsPerStory) + 1) * exam.questionsPerStory
  );
  const currentQuestion = exam.questions[currentQuestionIndex];
  const relativeQuestionIndex = currentQuestionIndex % exam.questionsPerStory;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.getVoices();
      
      // Some browsers load voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Show story when moving to a new story set
  useEffect(() => {
    if (currentQuestionIndex % exam.questionsPerStory === 0) {
      setShowStory(true);
      stopSpeaking();
    }
  }, [currentQuestionIndex]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const pauseSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const resumeSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    let score = 0;
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const result: ExamResult = {
      studentId: student.id,
      category: student.category,
      score,
      totalQuestions: exam.questions.length,
      percentage: (score / exam.questions.length) * 100,
      answers,
      completedAt: new Date().toISOString(),
    };

    onComplete(result);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (showStory) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Story Time</h2>
                <p className="text-gray-600">Read carefully before answering questions</p>
              </div>
              <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">{currentStorySet.title}</h3>
              </div>
              
              {/* Audio Controls */}
              <div className="flex items-center gap-3 mb-6">
                {!isSpeaking && !isPaused && (
                  <button
                    onClick={() => speakText(`${currentStorySet.title}. ${currentStorySet.content}`)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen to Story
                  </button>
                )}
                
                {isSpeaking && !isPaused && (
                  <button
                    onClick={pauseSpeaking}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}
                
                {isPaused && (
                  <button
                    onClick={resumeSpeaking}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </button>
                )}
                
                {(isSpeaking || isPaused) && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                  >
                    <VolumeX className="w-5 h-5" />
                    Stop
                  </button>
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentStorySet.content}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowStory(false);
                stopSpeaking();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Proceed to Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">{student.category === 'primary' ? 'Primary School' : 'High School'} Examination</p>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress: {currentQuestionIndex + 1} of {exam.questions.length}</span>
              <span>Answered: {answeredCount} of {exam.questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Story Reference */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">{currentStorySet.title}</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStory(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Read story again
                </button>
                <button
                  onClick={() => speakText(`${currentStorySet.title}. ${currentStorySet.content}`)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              Question {currentQuestionIndex + 1}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{currentQuestion.question}</h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestionIndex] === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestionIndex] === option
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === option && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          {currentQuestionIndex < exam.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Submit Examination
            </button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Question Navigator</h4>
          <div className="grid grid-cols-10 gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                  currentQuestionIndex === index
                    ? 'bg-purple-600 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}