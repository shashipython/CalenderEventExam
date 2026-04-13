import { useState } from 'react';
import { LogOut, UserPlus, FileText, Calendar, TrendingUp } from 'lucide-react';
import { StudentRegistration } from './parent/StudentRegistration';
import { DailyReports } from './parent/DailyReports';
import { AttendanceView } from './parent/AttendanceView';
import { ProgressView } from './parent/ProgressView';

interface ParentDashboardProps {
  onLogout: () => void;
}

type ParentView = 'register' | 'reports' | 'attendance' | 'progress';

export function ParentDashboard({ onLogout }: ParentDashboardProps) {
  const [currentView, setCurrentView] = useState<ParentView>('reports');

  const renderView = () => {
    switch (currentView) {
      case 'register':
        return <StudentRegistration />;
      case 'reports':
        return <DailyReports />;
      case 'attendance':
        return <AttendanceView />;
      case 'progress':
        return <ProgressView />;
      default:
        return <DailyReports />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl">Parent Portal</h1>
            <p className="text-green-100 text-sm">Track your child progress</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setCurrentView('register')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'register'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs">Register</span>
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'reports'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Reports</span>
          </button>
          <button
            onClick={() => setCurrentView('attendance')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'attendance'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Attendance</span>
          </button>
          <button
            onClick={() => setCurrentView('progress')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'progress'
                ? 'text-green-600'
                : 'text-gray-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
