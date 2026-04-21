import { useState } from 'react';
import { Bell, BookOpen, CalendarHeart, ChevronRight, LogIn, LogOut, School, UserPlus, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { Registration } from './components/Registration';
import { ExamInterface } from './components/ExamInterface';
import { Results } from './components/Results';
import { Certificate } from './components/Certificate';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';

export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  category: 'primary' | 'highschool';
  schoolName: string;
  grade: string;
}

export interface ExamResult {
  studentId: string;
  category: 'primary' | 'highschool';
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<number, string>;
  completedAt: string;
}

type AppState = 'home' | 'registration' | 'exam' | 'results' | 'certificate';
type AuthMode = 'login' | 'signup' | null;

interface AuthUser {
  name: string;
  email: string;
}

interface AuthControlsProps {
  user: AuthUser | null;
  mode: AuthMode;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onClose: () => void;
  onLogout: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onSignupSuccess: () => void;
}

function AuthNavBar({
  user,
  mode,
  onOpenLogin,
  onOpenSignUp,
  onClose,
  onLogout,
  onLoginSuccess,
  onSignupSuccess,
}: AuthControlsProps) {
  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid #dbeafe',
          background: 'rgb(255 255 255 / 0.92)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 20px -18px rgb(15 23 42 / 0.55)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-4 px-4"
          style={{
            minHeight: 72,
            maxWidth: 1120,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <School className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Bright Future School</p>
              <p className="text-sm text-gray-600">Event Story Portal</p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {user ? (
              <>
                <div
                  style={{
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    borderRadius: 999,
                    background: 'white',
                    border: '1px solid #bfdbfe',
                    padding: '10px 14px',
                    color: '#1f2937',
                    fontWeight: 600,
                  }}
                  title={user.email}
                >
                  {user.name}
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 10,
                    background: '#dc2626',
                    color: 'white',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 10,
                    background: '#16a34a',
                    color: 'white',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 10,
                    background: '#2563eb',
                    color: 'white',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {mode && !user && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflowY: 'auto',
            background: 'rgb(15 23 42 / 0.45)',
            padding: '96px 16px 32px',
          }}
          onMouseDown={onClose}
        >
          <div
            className="bg-white shadow-2xl"
            style={{
              width: 'min(100%, 720px)',
              borderRadius: 16,
              padding: 24,
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex gap-2">
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  style={{
                    borderRadius: 10,
                    background: mode === 'signup' ? '#16a34a' : '#f3f4f6',
                    color: mode === 'signup' ? 'white' : '#374151',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  style={{
                    borderRadius: 10,
                    background: mode === 'login' ? '#2563eb' : '#f3f4f6',
                    color: mode === 'login' ? 'white' : '#374151',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Login
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close auth form"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: '#f3f4f6',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {mode === 'signup' ? (
              <SignUpForm onSuccess={onSignupSuccess} />
            ) : (
              <LoginForm onSuccess={onLoginSuccess} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
interface LandingPageProps {
  onOpenRegistration: () => void;
}

function LandingPage({ onOpenRegistration }: LandingPageProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-500 p-8 text-white shadow-2xl">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <School className="h-8 w-8" />
          </div>
          <p className="mb-3 text-sm font-semibold">WELCOME TO THE SCHOOL PORTAL</p>
          <h1 className="mb-4 text-4xl font-bold">Bright Future School Main Landing Page</h1>
          <p className="max-w-4xl text-lg leading-relaxed text-blue-50">
            A simple school dashboard for announcements, notifications, and student participation in the Event Story registration flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-200 bg-white p-8 shadow-xl">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <Bell className="h-7 w-7 text-blue-600" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Alert and Notification</h2>
            <p className="mb-6 text-gray-600">
              Stay updated with exam reminders, event schedules, holiday circulars, and important school announcements.
            </p>
            <div className="space-y-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="font-semibold text-blue-900">Monday Assembly</p>
                <p className="text-sm text-gray-600">All students report by 8:30 AM in full uniform.</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="font-semibold text-gray-900">Exam Notice</p>
                <p className="text-sm text-gray-600">Event Story registrations are open for primary and high school students.</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="font-semibold text-green-900">Parent Update</p>
                <p className="text-sm text-gray-600">Digital progress and attendance updates are available in the portal.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRegistration}
            className="rounded-2xl border border-purple-200 bg-white p-8 text-left shadow-xl transition-all hover:scale-[1.02] hover:border-purple-300"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
                <CalendarHeart className="h-7 w-7 text-purple-600" />
              </div>
              <ChevronRight className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Register for Event Story</h2>
            <p className="mb-6 text-gray-600">
              Open the student registration page to join the Event Story activity and continue into the exam flow.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <p className="text-sm text-gray-700">Story-based exam experience for students</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                <School className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-gray-700">School name, class, and category registration</p>
              </div>
            </div>
            <div className="mt-6 inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white">
              Open Registration
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const handleRegistrationComplete = (student: Student) => {
    setCurrentStudent(student);
    setAppState('exam');
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
    setAppState('results');
  };

  const handleViewCertificate = () => {
    setAppState('certificate');
  };

  const handleStartNew = () => {
    setCurrentStudent(null);
    setExamResult(null);
    setAppState('home');
  };

  const handleSignupSuccess = () => {
    setAuthMode('login');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setAuthMode(null);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthMode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster richColors position="top-center" />
      <AuthNavBar
        user={authUser}
        mode={authMode}
        onOpenLogin={() => setAuthMode('login')}
        onOpenSignUp={() => setAuthMode('signup')}
        onClose={() => setAuthMode(null)}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />

      {appState === 'home' && (
        <LandingPage onOpenRegistration={() => setAppState('registration')} />
      )}

      {appState === 'registration' && (
        <Registration
          onComplete={handleRegistrationComplete}
          onBack={() => setAppState('home')}
        />
      )}
      
      {appState === 'exam' && currentStudent && (
        <ExamInterface 
          student={currentStudent} 
          onComplete={handleExamComplete} 
        />
      )}
      
      {appState === 'results' && currentStudent && examResult && (
        <Results 
          student={currentStudent}
          result={examResult}
          onViewCertificate={handleViewCertificate}
          onStartNew={handleStartNew}
        />
      )}
      
      {appState === 'certificate' && currentStudent && examResult && (
        <Certificate 
          student={currentStudent}
          result={examResult}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
}
