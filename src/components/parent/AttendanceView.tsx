import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export function AttendanceView() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadAttendance();
  }, [selectedMonth]);

  const loadAttendance = () => {
    const allReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
    const attendance: AttendanceRecord[] = allReports
      .filter((r: any) => r.date.startsWith(selectedMonth))
      .map((r: any) => ({
        date: r.date,
        status: r.attendance
      }));
    setAttendanceData(attendance);
  };

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(a => a.status === 'present').length,
    absent: attendanceData.filter(a => a.status === 'absent').length,
    percentage: attendanceData.length > 0 
      ? Math.round((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100)
      : 0
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-3">Attendance Overview</h2>
        
        <div>
          <label className="block text-gray-700 text-sm mb-2">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm">Present</span>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl">{stats.present}</div>
          <div className="text-green-100 text-sm">Days</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm">Absent</span>
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl">{stats.absent}</div>
          <div className="text-red-100 text-sm">Days</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Attendance Rate</h3>
          <div className={`text-2xl ${
            stats.percentage >= 90 ? 'text-green-600' :
            stats.percentage >= 75 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {stats.percentage}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              stats.percentage >= 90 ? 'bg-green-600' :
              stats.percentage >= 75 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Attendance List */}
      {attendanceData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-3">Daily Record</h3>
          <div className="space-y-2">
            {attendanceData.map((record, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  record.status === 'present' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {record.status === 'present' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="capitalize">{record.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2">No Attendance Data</h3>
          <p className="text-gray-600 text-sm">
            No attendance records found for the selected month.
          </p>
        </div>
      )}
    </div>
  );
}
