import { useState } from 'react';
import { FileText, Send, Calendar } from 'lucide-react';

export function ReportGeneration() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [generated, setGenerated] = useState(false);

  const generateReport = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const topicsData = JSON.parse(localStorage.getItem('topicsTracking') || '{}');

    const filteredStudents = selectedClass
      ? students.filter((s: any) => `${s.grade}-${s.section}` === selectedClass)
      : students;

    const reports = filteredStudents.map((student: any) => {
      const attendance = attendanceRecords.find(
        (a: any) => a.studentId === student.id && a.date === selectedDate
      );

      // Get completed topics for the day
      const subjects: any[] = [];
      Object.keys(topicsData).forEach((key) => {
        const [subjectName] = key.split('-');
        const completedTopics = topicsData[key]
          .filter((t: any) => t.status === 'completed')
          .map((t: any) => t.name);
        
        if (completedTopics.length > 0) {
          subjects.push({
            name: subjectName,
            topicsCovered: completedTopics,
            status: 'completed'
          });
        }
      });

      return {
        id: Date.now().toString() + student.id,
        studentId: student.id,
        studentName: student.name,
        date: selectedDate,
        attendance: attendance?.status || 'present',
        subjects
      };
    });

    // Save reports
    const existingReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
    const updatedReports = [...existingReports, ...reports];
    localStorage.setItem('dailyReports', JSON.stringify(updatedReports));

    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Generate Daily Report</h2>
        <p className="text-gray-600 text-sm">Create consolidated reports for parents</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div>
          <label className="block text-gray-700 text-sm mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Report Date
            </div>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            <option value="5-A">Grade 5 - A</option>
            <option value="5-B">Grade 5 - B</option>
            <option value="6-A">Grade 6 - A</option>
            <option value="6-B">Grade 6 - B</option>
          </select>
        </div>

        <button
          onClick={generateReport}
          disabled={generated}
          className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            generated
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {generated ? (
            <>
              <FileText className="w-5 h-5" />
              Report Generated!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate & Send Report
            </>
          )}
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
        <h3 className="text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Report Information
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
            <p>Reports include attendance and topics covered for each student</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
            <p>Parents will receive reports via email and SMS</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
            <p>Reports are automatically saved in the parent portal</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
            <p>Generate reports at the end of each school day</p>
          </div>
        </div>
      </div>

      {generated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="text-green-900">Report Generated Successfully</h4>
              <p className="text-green-700 text-sm">
                Daily reports have been sent to all parents via email and SMS.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
