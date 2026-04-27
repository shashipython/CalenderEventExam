import { useEffect, useState } from 'react';
import { Bell, BookOpen, CalendarHeart, ChevronRight, LogIn, LogOut, School, User, UserPlus, X } from 'lucide-react';
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
  eventId: string;
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
  id: string;
  name: string;
  email: string;
}

interface UserProfile {
  id: number;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  mobile_no: string;
  alternate_mobile_no: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  occupation: string;
  annual_income: string;
  relation_type: string;
  whatsapp_no: string;
  status: string;
}

const AUTH_USER_STORAGE_KEY = 'event-story-auth-user';

interface AuthControlsProps {
  user: AuthUser | null;
  mode: AuthMode;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onClose: () => void;
  onLogout: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onSignupSuccess: () => void;
  onOpenProfile: () => void;
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
  onOpenProfile,
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
                  Welcome, {user.name}
                </div>
                <button
                  type="button"
                  onClick={onOpenProfile}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: 10,
                    background: '#7c3aed',
                    color: 'white',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
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
            <div className="mb-4 flex items-center justify-end">
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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

function ProfileModal({ isOpen, onClose, userId }: ProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('https://d8we8zpuoj.execute-api.us-east-1.amazonaws.com/default/event_get_parent_details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });
      const data = await response.json();
      if (data.data) {
        setFormData(data.data);
      } else if (data.message) {
        setFormData({});
      }
    } catch (err) {
      setError('Failed to fetch parent details');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('https://t7fncp3sq7.execute-api.us-east-1.amazonaws.com/default/event_parent_update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Details has been updated successfully');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to update details');
      }
    } catch (err) {
      setError('Failed to update details');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const fields: { key: keyof UserProfile; label: string; readonly?: boolean }[] = [
    { key: 'father_name', label: 'Father Name' },
    { key: 'mother_name', label: 'Mother Name' },
    { key: 'guardian_name', label: 'Guardian Name' },
    { key: 'mobile_no', label: 'Mobile No' },
    { key: 'alternate_mobile_no', label: 'Alternate Mobile No' },
    { key: 'email', label: 'Email', readonly: true },
    { key: 'address_line1', label: 'Address Line 1' },
    { key: 'address_line2', label: 'Address Line 2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'annual_income', label: 'Annual Income' },
    { key: 'relation_type', label: 'Relation Type' },
    { key: 'whatsapp_no', label: 'WhatsApp No' },
    { key: 'status', label: 'Status' },
  ];

  return (
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
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
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

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={formData[field.key] || ''}
                    readOnly={field.readonly}
                    onChange={(e) => !field.readonly && handleChange(field.key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: field.readonly ? '1px solid #e5e7eb' : '1px solid #d1d5db',
                      fontSize: 14,
                      backgroundColor: field.readonly ? '#f9fafb' : 'white',
                      color: field.readonly ? '#6b7280' : '#1f2937',
                      cursor: field.readonly ? 'not-allowed' : 'auto',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#374151',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#2563eb',
                  color: 'white',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface LandingPageProps {
  onOpenRegistration: () => void;
  user: AuthUser | null;
}

function LandingPage({ onOpenRegistration, user }: LandingPageProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-500 p-8 text-white shadow-2xl">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <School className="h-8 w-8" />
          </div>
          {user && (
            <p className="mb-3 text-base font-semibold text-emerald-100">
              Welcome, {user.name}
            </p>
          )}
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
  const [showProfile, setShowProfile] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (authUser) {
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authUser));
      return;
    }

    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  }, [authUser]);

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
        onOpenProfile={() => setShowProfile(true)}
      />

      {showProfile && authUser && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userId={authUser.id}
        />
      )}

      {appState === 'home' && (
        <LandingPage
          onOpenRegistration={() => setAppState('registration')}
          user={authUser}
        />
      )}

      {appState === 'registration' && (
        <Registration
          onComplete={handleRegistrationComplete}
          onBack={() => setAppState('home')}
          user={authUser}
        />
      )}
      
      {appState === 'exam' && currentStudent && (
        <ExamInterface 
          student={currentStudent}
          eventId={currentStudent.eventId}
          grade={currentStudent.grade}
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
