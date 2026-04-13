import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export function PerformanceMonitoring() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageAttendance: 0,
    activeClasses: 0,
    reportsGenerated: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const reports = JSON.parse(localStorage.getItem('dailyReports') || '[]');

    const presentRecords = attendanceRecords.filter((a: any) => a.status === 'present');
    const avgAttendance = attendanceRecords.length > 0
      ? Math.round((presentRecords.length / attendanceRecords.length) * 100)
      : 0;

    setStats({
      totalStudents: students.length,
      averageAttendance: avgAttendance,
      activeClasses: classes.length,
      reportsGenerated: reports.length
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Performance Monitoring</h2>
        <p className="text-gray-600 text-sm">Track academic progress and system usage</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm">Total Students</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">{stats.totalStudents}</div>
          <div className="text-blue-100 text-xs">Enrolled</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm">Avg Attendance</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">{stats.averageAttendance}%</div>
          <div className="text-green-100 text-xs">Overall</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm">Active Classes</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">{stats.activeClasses}</div>
          <div className="text-purple-100 text-xs">Running</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100 text-sm">Reports</span>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-3xl mb-1">{stats.reportsGenerated}</div>
          <div className="text-orange-100 text-xs">Generated</div>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-gray-900 mb-4">System Overview</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 text-sm">Student Enrollment</span>
              <span className="text-gray-900">{stats.totalStudents}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((stats.totalStudents / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 text-sm">Attendance Rate</span>
              <span className="text-gray-900">{stats.averageAttendance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  stats.averageAttendance >= 90 ? 'bg-green-600' :
                  stats.averageAttendance >= 75 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${stats.averageAttendance}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 text-sm">Class Capacity</span>
              <span className="text-gray-900">{stats.activeClasses}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(stats.activeClasses / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
            <div className="flex-1">
              <div className="text-gray-900 text-sm">Daily reports generated</div>
              <div className="text-gray-600 text-xs">Today at 4:00 PM</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            <div className="flex-1">
              <div className="text-gray-900 text-sm">Attendance marked</div>
              <div className="text-gray-600 text-xs">Today at 9:00 AM</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full" />
            <div className="flex-1">
              <div className="text-gray-900 text-sm">New student registered</div>
              <div className="text-gray-600 text-xs">Yesterday</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-4">
        <h3 className="text-purple-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-white text-purple-700 py-3 rounded-lg hover:bg-purple-50 transition-colors text-sm">
            View Detailed Reports
          </button>
          <button className="w-full bg-white text-purple-700 py-3 rounded-lg hover:bg-purple-50 transition-colors text-sm">
            Export Data
          </button>
          <button className="w-full bg-white text-purple-700 py-3 rounded-lg hover:bg-purple-50 transition-colors text-sm">
            Send Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
