import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  FileCheck,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { TeacherAssignmentsForm } from './teacher/TeacherAssignmentsForm';
import { TeacherAttendanceForm } from './teacher/TeacherAttendanceForm';
import { TeacherLeaveApprovalForm } from './teacher/TeacherLeaveApprovalForm';
import { TeacherMarksEntryForm } from './teacher/TeacherMarksEntryForm';
import { TeacherNotificationsForm } from './teacher/TeacherNotificationsForm';
import { TeacherSubjectsClassesForm } from './teacher/TeacherSubjectsClassesForm';

interface TeacherDashboardProps {
  teacherId: string;
  teacherName?: string;
  onLogout: () => void;
}

type TeacherService =
  | 'attendance'
  | 'leave'
  | 'assignments'
  | 'notifications'
  | 'marks'
  | 'subjects';

const services: Array<{
  key: TeacherService;
  title: string;
  description: string;
  icon: typeof CheckSquare;
  color: string;
}> = [
  {
    key: 'attendance',
    title: 'Attendance',
    description: 'Mark and submit daily class attendance.',
    icon: CalendarCheck,
    color: '#2563eb',
  },
  {
    key: 'leave',
    title: 'Leave Approval',
    description: 'Review student leave requests and record decisions.',
    icon: FileCheck,
    color: '#16a34a',
  },
  {
    key: 'assignments',
    title: 'Assignments',
    description: 'Create assignments with due dates and instructions.',
    icon: ClipboardList,
    color: '#7c3aed',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Send class or parent announcements.',
    icon: Bell,
    color: '#ca8a04',
  },
  {
    key: 'marks',
    title: 'Marks Entry',
    description: 'Enter exam marks for students and subjects.',
    icon: CheckSquare,
    color: '#dc2626',
  },
  {
    key: 'subjects',
    title: 'Subjects & Classes',
    description: 'Manage assigned subjects, sections, and schedules.',
    icon: BookOpen,
    color: '#0891b2',
  },
];

export function TeacherDashboard({ teacherId, teacherName, onLogout }: TeacherDashboardProps) {
  const [activeService, setActiveService] = useState<TeacherService | null>(null);

  const renderServiceForm = () => {
    switch (activeService) {
      case 'attendance':
        return <TeacherAttendanceForm teacherId={teacherId} />;
      case 'leave':
        return <TeacherLeaveApprovalForm teacherId={teacherId} />;
      case 'assignments':
        return <TeacherAssignmentsForm teacherId={teacherId} />;
      case 'notifications':
        return <TeacherNotificationsForm teacherId={teacherId} />;
      case 'marks':
        return <TeacherMarksEntryForm teacherId={teacherId} />;
      case 'subjects':
        return <TeacherSubjectsClassesForm teacherId={teacherId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
                <GraduationCap className="h-7 w-7" />
              </div>
              <p className="mb-2 text-sm font-semibold text-blue-100">TEACHER PORTAL</p>
              <h1 className="text-4xl font-bold">
                {teacherName ? `Welcome, ${teacherName}` : 'Teacher Dashboard'}
              </h1>
              <p className="mt-3 max-w-3xl text-blue-50">
                Access only teacher services assigned to your account. Teacher ID: {teacherId}
              </p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-3 font-semibold text-white hover:bg-white/30"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {activeService ? (
          <div>
            <button
              type="button"
              onClick={() => setActiveService(null)}
              className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teacher Services
            </button>
            {renderServiceForm()}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setActiveService(service.key)}
                  className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${service.color}1A`, color: service.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-gray-900">{service.title}</h2>
                  <p className="text-gray-600">{service.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
