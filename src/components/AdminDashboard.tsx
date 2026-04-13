import { useState } from 'react';
import { LogOut, UserCheck, Users, BookOpen, BarChart3 } from 'lucide-react';
import { RegistrationProcessing } from './admin/RegistrationProcessing';
import { ClassAllocation } from './admin/ClassAllocation';
import { SubjectAssignment } from './admin/SubjectAssignment';
import { PerformanceMonitoring } from './admin/PerformanceMonitoring';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = 'registrations' | 'classes' | 'subjects' | 'performance';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('registrations');

  const renderView = () => {
    switch (currentView) {
      case 'registrations':
        return <RegistrationProcessing />;
      case 'classes':
        return <ClassAllocation />;
      case 'subjects':
        return <SubjectAssignment />;
      case 'performance':
        return <PerformanceMonitoring />;
      default:
        return <RegistrationProcessing />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl">Admin Portal</h1>
            <p className="text-purple-100 text-sm">School Management System</p>
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
            onClick={() => setCurrentView('registrations')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'registrations'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-xs">Register</span>
          </button>
          <button
            onClick={() => setCurrentView('classes')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'classes'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Classes</span>
          </button>
          <button
            onClick={() => setCurrentView('subjects')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'subjects'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Subjects</span>
          </button>
          <button
            onClick={() => setCurrentView('performance')}
            className={`flex flex-col items-center gap-1 py-3 ${
              currentView === 'performance'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Monitor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
