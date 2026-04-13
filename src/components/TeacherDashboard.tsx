import { useState } from 'react';
import { LogOut, Users, BookOpen, CheckSquare, FileText } from 'lucide-react';
import { ClassManagement } from './teacher/ClassManagement';
import { AttendanceManagement } from './teacher/AttendanceManagement';
import { TopicTracking } from './teacher/TopicTracking';
import { ReportGeneration } from './teacher/ReportGeneration';

interface TeacherDashboardProps {
  onLogout: () => void;
}

type TeacherView = 'classes' | 'attendance' | 'topics' | 'reports';

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [currentView, setCurrentView] = useState<TeacherView>('classes');

  const renderView = () => {
    switch (currentView) {
      case 'classes':
        return <ClassManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'topics':
        return <TopicTracking />;
      case 'reports':
        return <ReportGeneration />;
      default:
        return <ClassManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl">Teacher Portal</h1>
            <p className="text-blue-100 text-sm">Manage classes & track progress</p>
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
            onClick={() => setCurrentView('classes')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'classes'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Classes</span>
          </button>
          <button
            onClick={() => setCurrentView('attendance')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'attendance'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Attendance</span>
          </button>
          <button
            onClick={() => setCurrentView('topics')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'topics'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Topics</span>
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'reports'
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
