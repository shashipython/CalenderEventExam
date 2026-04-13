import { Award, Download, RotateCcw, Calendar, Trophy } from 'lucide-react';
import type { Student, ExamResult } from '../App';

interface CertificateProps {
  student: Student;
  result: ExamResult;
  onStartNew: () => void;
}

export function Certificate({ student, result, onStartNew }: CertificateProps) {
  const handleDownload = () => {
    window.print();
  };

  const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Start New
          </button>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 border-8 border-double border-blue-900">
          {/* Header Decoration */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
              <Award className="w-16 h-16 text-blue-600" />
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Certificate of Achievement</h1>
            <p className="text-xl text-gray-600">Summer Camp Examination Portal</p>
          </div>

          {/* Certificate Body */}
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
              <h2 className="text-4xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2 inline-block px-8">
                {student.name}
              </h2>
            </div>

            <p className="text-center text-lg text-gray-700 leading-relaxed">
              has successfully completed the <strong>{student.category === 'primary' ? 'Primary School' : 'High School'}</strong> examination
              <br />
              and demonstrated excellence in comprehension and analytical skills
            </p>

            {/* Achievement Details */}
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-2xl font-bold text-blue-900">
                  {result.score}/{result.totalQuestions}
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Percentage</p>
                <p className="text-2xl font-bold text-purple-900">
                  {result.percentage.toFixed(1)}%
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className="text-2xl font-bold text-blue-900">
                  {result.percentage >= 90 ? 'A+' : 
                   result.percentage >= 80 ? 'A' :
                   result.percentage >= 70 ? 'B' : 'C'}
                </p>
              </div>
            </div>

            {/* Student Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p className="font-semibold text-gray-900">{student.schoolName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade/Class</p>
                  <p className="font-semibold text-gray-900">{student.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-semibold text-gray-900">{student.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Completion</p>
                  <p className="font-semibold text-gray-900">{completedDate}</p>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid md:grid-cols-2 gap-12 mt-12 pt-8 border-t-2 border-gray-200">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 inline-block px-8">
                  <p className="font-semibold text-gray-900">Examination Coordinator</p>
                  <p className="text-sm text-gray-600">Summer Camp Portal</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 inline-block px-8">
                  <p className="font-semibold text-gray-900">Program Director</p>
                  <p className="text-sm text-gray-600">Educational Committee</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Certificate ID: CERT-{student.id}-{new Date(result.completedAt).getTime()}
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="flex items-center justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
          </div>
        </div>

        {/* Print Instructions */}
        <div className="text-center mt-6 text-gray-600 print:hidden">
          <p className="text-sm">
            Click "Download Certificate" to save or print this certificate for your records.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
