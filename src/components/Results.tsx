import { Trophy, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import type { Student, ExamResult } from '../App';

interface ResultsProps {
  student: Student;
  result: ExamResult;
  onViewCertificate: () => void;
  onStartNew: () => void;
}

export function Results({ student, result, onViewCertificate, onStartNew }: ResultsProps) {
  const isPassed = result.percentage >= 60;
  const grade = result.percentage >= 90 ? 'A+' : 
                result.percentage >= 80 ? 'A' :
                result.percentage >= 70 ? 'B' :
                result.percentage >= 60 ? 'C' : 'F';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            isPassed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isPassed ? (
              <Trophy className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isPassed ? 'Congratulations!' : 'Examination Completed'}
          </h1>
          <p className="text-lg text-gray-600">
            {isPassed ? 'You have successfully passed the examination!' : 'Keep learning and try again!'}
          </p>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Examination Results</h2>
            <p className="text-gray-600">Student: {student.name}</p>
            <p className="text-gray-600">Category: {student.category === 'primary' ? 'Primary School' : 'High School'}</p>
          </div>

          {/* Score Display */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-sm text-blue-600 font-semibold mb-2">Score</p>
              <p className="text-4xl font-bold text-blue-900">
                {result.score}/{result.totalQuestions}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <p className="text-sm text-purple-600 font-semibold mb-2">Percentage</p>
              <p className="text-4xl font-bold text-purple-900">
                {result.percentage.toFixed(1)}%
              </p>
            </div>

            <div className={`rounded-xl p-6 text-center ${
              isPassed ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className={`text-sm font-semibold mb-2 ${
                isPassed ? 'text-green-600' : 'text-red-600'
              }`}>Grade</p>
              <p className={`text-4xl font-bold ${
                isPassed ? 'text-green-900' : 'text-red-900'
              }`}>
                {grade}
              </p>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Correct Answers</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">{result.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Incorrect Answers</span>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">{result.totalQuestions - result.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Accuracy Rate</span>
                <span className="font-semibold text-gray-900">{result.percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Overall Performance</span>
              <span>{result.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  isPassed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          {isPassed ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800">
                <strong>Excellent work!</strong> You have successfully completed the examination with a passing grade. Your certificate is ready to download.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Keep practicing!</strong> You need at least 60% to pass. Don't give up - review the material and try again!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isPassed && (
              <button
                onClick={onViewCertificate}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Award className="w-5 h-5" />
                View Certificate
              </button>
            )}
            <button
              onClick={onStartNew}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Start New Examination
            </button>
          </div>
        </div>

        {/* Completion Time */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            Completed on {new Date(result.completedAt).toLocaleDateString()} at {new Date(result.completedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
