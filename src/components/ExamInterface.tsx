import { useState, useEffect } from 'react';
import { Clock, BookOpen, CheckCircle, Volume2, VolumeX, Pause, Play, Loader2 } from 'lucide-react';
import type { Student, ExamResult } from '../App';

interface Question {
  question_id: number;
  question_text: string;
  options: {
    option_id: number;
    option_text: string;
    is_correct: boolean;
  }[];
}

interface Story {
  story_id: number;
  story_title: string;
  story_text: string;
  questions: Question[];
}

interface ExamInterfaceProps {
  student: Student;
  eventId: string;
  grade: string;
  onComplete: (result: ExamResult) => void;
}

const QUESTIONS_API_URL = '/api/event_get_story_quations';

export function ExamInterface({ student, eventId, grade, onComplete }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [showStory, setShowStory] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(QUESTIONS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_id: Number(eventId),
            grade: Number(grade),
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            (result && typeof result === 'object' && ('message' in result || 'error' in result)
              ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error)
              : '') || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (result?.stories && Array.isArray(result.stories)) {
          setStories(result.stories);
        } else {
          throw new Error('No stories found for this event and grade');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId && grade) {
      fetchQuestions();
    }
  }, [eventId, grade]);

  // Flatten all questions from all stories for easy access
  const allQuestions = stories.flatMap((story) =>
    story.questions.map((q) => ({
      ...q,
      storyTitle: story.story_title,
      storyText: story.story_text,
    }))
  );

  const currentStory = stories[Math.floor(currentQuestionIndex / (stories[0]?.questions.length || 1))];
  const currentQuestion = allQuestions[currentQuestionIndex];

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
    // Show story at the start of each story
    const questionsPerStory = stories[0]?.questions.length || 1;
    if (currentQuestionIndex % questionsPerStory === 0) {
      setShowStory(true);
      stopSpeaking();
    }
  }, [currentQuestionIndex, stories]);

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
    if (currentQuestionIndex < allQuestions.length - 1) {
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
    allQuestions.forEach((question, index) => {
      const selectedAnswer = answers[index];
      if (selectedAnswer) {
        const correctOption = question.options.find((opt) => opt.is_correct);
        if (correctOption && selectedAnswer === correctOption.option_text) {
          score++;
        }
      }
    });

    const totalMarks = allQuestions.length;
    const percentage = allQuestions.length > 0 ? (score / allQuestions.length) * 100 : 0;

    const result: ExamResult = {
      studentId: student.id,
      category: student.category,
      score,
      totalQuestions: allQuestions.length,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
    };

    // Submit exam results to API
    const submitToAPI = async () => {
      try {
        const response = await fetch('https://ezrib3bxac.execute-api.us-east-1.amazonaws.com/default/event_insert_result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: student.id,
            event_id: Number(eventId),
            score: score,
            total_marks: totalMarks,
            percentage: percentage,
          }),
        });

        if (!response.ok) {
          console.error('Failed to submit exam results to API');
        } else {
          console.log('Exam results submitted successfully');
        }
      } catch (error) {
        console.error('Error submitting exam results:', error);
      }
    };

    submitToAPI();
    onComplete(result);
  };

  const progressPercentage = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">No questions found for this event and grade.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showStory && currentStory) {
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
                <h3 className="text-2xl font-bold text-gray-900">{currentStory.story_title}</h3>
              </div>
              
              {/* Audio Controls */}
              <div className="flex items-center gap-3 mb-6">
                {!isSpeaking && !isPaused && (
                  <button
                    onClick={() => speakText(`${currentStory.story_title}. ${currentStory.story_text}`)}
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
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentStory.story_text}</p>
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
              <span>Progress: {currentQuestionIndex + 1} of {allQuestions.length}</span>
              <span>Answered: {answeredCount} of {allQuestions.length}</span>
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
        {currentStory && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">{currentStory.story_title}</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowStory(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Read story again
                  </button>
                  <button
                    onClick={() => speakText(`${currentStory.story_title}. ${currentStory.story_text}`)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Volume2 className="w-4 h-4" />
                    Listen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              Question {currentQuestionIndex + 1}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{currentQuestion?.question_text}</h3>
          </div>

          <div className="space-y-3">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.option_id}
                onClick={() => handleAnswerSelect(option.option_text)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestionIndex] === option.option_text
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestionIndex] === option.option_text
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === option.option_text && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option.option_text}</span>
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
          
          {currentQuestionIndex < allQuestions.length - 1 ? (
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
            {allQuestions.map((_, index) => (
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