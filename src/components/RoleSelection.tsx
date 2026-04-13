import { Users, GraduationCap, Shield } from 'lucide-react';
import { Role } from '../App';

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-white mb-2">Student Tracking System</h1>
          <p className="text-blue-100">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectRole('parent')}
            className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <div className="text-gray-900 mb-1">Parent</div>
              <p className="text-gray-600 text-sm">Register student & view reports</p>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('teacher')}
            className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-gray-900 mb-1">Teacher</div>
              <p className="text-gray-600 text-sm">Manage classes & track progress</p>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('admin')}
            className="w-full bg-white rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="text-gray-900 mb-1">School Admin</div>
              <p className="text-gray-600 text-sm">Manage students, classes & subjects</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
