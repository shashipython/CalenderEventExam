import { useState, useEffect } from 'react';
import { Calendar, BookOpen, CheckCircle, Clock, Mail, MessageSquare } from 'lucide-react';

interface DailyReport {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  attendance: 'present' | 'absent';
  subjects: {
    name: string;
    topicsCovered: string[];
    status: 'completed' | 'in-progress';
  }[];
}

export function DailyReports() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadReports();
  }, [selectedDate]);

  const loadReports = () => {
    const allReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
    const filteredReports = allReports.filter((r: DailyReport) => r.date === selectedDate);
    setReports(filteredReports);
  };

  const sendNotification = (type: 'email' | 'sms', reportId: string) => {
    alert(`${type === 'email' ? 'Email' : 'SMS'} notification sent successfully!`);
  };

  if (reports.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-gray-700 text-sm mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2">No Reports Available</h3>
          <p className="text-gray-600 text-sm">
            Daily reports will appear here once your child attends classes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <label className="block text-gray-700 text-sm mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h3>{report.studentName}</h3>
              <div className={`px-3 py-1 rounded-full text-sm ${
                report.attendance === 'present' 
                  ? 'bg-white/20' 
                  : 'bg-red-500'
              }`}>
                {report.attendance === 'present' ? 'Present' : 'Absent'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-100 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(report.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Subjects */}
          <div className="p-4 space-y-4">
            <h4 className="text-gray-900">Today&apos;s Activities</h4>
            
            {report.subjects.map((subject, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900">{subject.name}</span>
                  </div>
                  {subject.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-gray-700 text-sm mb-2">Topics Covered:</p>
                  {subject.topicsCovered.map((topic, topicIdx) => (
                    <div key={topicIdx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-gray-600">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notification Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => sendNotification('email', report.id)}
                className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Send Email</span>
              </button>
              <button
                onClick={() => sendNotification('sms', report.id)}
                className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Send SMS</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
