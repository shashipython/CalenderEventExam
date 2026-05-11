import { useEffect, useState } from 'react';
import { Bell, BookOpen, CalendarHeart, ChevronRight, FileText, LogIn, LogOut, School, TrendingUp, User, UserPlus, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { API_CONFIG } from './config/apiConfig';
import { Registration } from './components/Registration';
import { ExamInterface } from './components/ExamInterface';
import { Results } from './components/Results';
import { Certificate } from './components/Certificate';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import { AlertNotification } from './components/AlertNotification';
import { TeacherDashboard } from './components/TeacherDashboard';
import ParentPerformanceAnalysis from './components/ParentPerformanceAnalysis';
import { LeaveRequest } from './components/parent/LeaveRequest';

export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  category: 'primary' | 'highschool';
  schoolName: string;
  grade: string;
  gender?: string;
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

type AppState = 'home' | 'registration' | 'exam' | 'results' | 'certificate' | 'notifications' | 'leaveRequest' | 'performanceAnalysis';
type AuthMode = 'login' | 'signup' | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
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

const getAuthRole = (user: AuthUser | null) => (user?.role || 'parent').toLowerCase();
const isTeacherUser = (user: AuthUser | null) => getAuthRole(user) === 'teacher';
const isParentUser = (user: AuthUser | null) => getAuthRole(user) === 'parent';

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
  const role = getAuthRole(user);

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
                  Welcome, {user.name} {role === 'teacher' ? '(Teacher)' : '(Parent)'}
                </div>
                {role === 'parent' && (
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
                )}
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
  const [activeTab, setActiveTab] = useState<'details' | 'students'>('details');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    grade: '',
  });
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(API_CONFIG.GET_PARENT_DETAILS_URL, {
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
      const response = await fetch(API_CONFIG.UPDATE_PARENT_DETAILS_URL, {
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'details' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'details' ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === 'details' ? 600 : 400,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Parent Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            style={{
              padding: '12px 20px',
              borderBottom: activeTab === 'students' ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === 'students' ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === 'students' ? 600 : 400,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            Add Student
          </button>
        </div>

        {activeTab === 'details' && (
          <>
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
          </>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {studentError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{studentError}</p>
              </div>
            )}

            {studentSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{studentSuccess}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={studentForm.first_name}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, first_name: e.target.value });
                    setStudentError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={studentForm.last_name}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, last_name: e.target.value });
                    setStudentError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={studentForm.dob}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, dob: e.target.value });
                    setStudentError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={studentForm.gender}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, gender: e.target.value });
                    setStudentError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    backgroundColor: 'white',
                  }}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <input
                  type="number"
                  value={studentForm.grade}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, grade: e.target.value });
                    setStudentError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                  }}
                  placeholder="Enter grade (1-12)"
                  min="1"
                  max="12"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setStudentForm({
                    first_name: '',
                    last_name: '',
                    dob: '',
                    gender: '',
                    grade: '',
                  });
                  setStudentError(null);
                  setStudentSuccess(null);
                }}
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
                Reset
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Validation
                  if (!studentForm.first_name.trim()) {
                    setStudentError('First name is required');
                    return;
                  }
                  if (!studentForm.last_name.trim()) {
                    setStudentError('Last name is required');
                    return;
                  }
                  if (!studentForm.dob) {
                    setStudentError('Date of birth is required');
                    return;
                  }
                  if (!studentForm.gender) {
                    setStudentError('Gender is required');
                    return;
                  }
                  if (!studentForm.grade) {
                    setStudentError('Grade is required');
                    return;
                  }

                  setSaving(true);
                  setStudentError(null);
                  setStudentSuccess(null);

                  try {
                    const response = await fetch(API_CONFIG.STUDENT_INSERT_URL, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        first_name: studentForm.first_name,
                        last_name: studentForm.last_name,
                        dob: studentForm.dob,
                        gender: studentForm.gender,
                        grade: parseInt(studentForm.grade),
                        user_id: parseInt(userId),
                      }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                      setStudentSuccess('Student added successfully!');
                      setStudentForm({
                        first_name: '',
                        last_name: '',
                        dob: '',
                        gender: '',
                        grade: '',
                      });
                    } else {
                      setStudentError(data.message || 'Failed to add student');
                    }
                  } catch (err) {
                    setStudentError('Failed to add student');
                    console.error('Error adding student:', err);
                  } finally {
                    setSaving(false);
                  }
                }}
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
                {saving ? 'Submitting...' : 'Submit'}
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
  onOpenNotifications: () => void;
  onOpenLeaveRequest: () => void;
  onOpenPerformanceAnalysis: () => void;
  onOpenLogin: () => void;
  user: AuthUser | null;
}

function LandingPage({ onOpenRegistration, onOpenNotifications, onOpenLeaveRequest, onOpenPerformanceAnalysis, onOpenLogin, user }: LandingPageProps) {
  if (user) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-500 p-8 text-white shadow-2xl">
            <p className="mb-3 text-base font-semibold text-emerald-100">Welcome, {user.name}</p>
            <h1 className="mb-4 text-4xl font-bold">Parent Dashboard</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-blue-50">
              Access school notifications, register your child for Calendar Event Examination, and manage student services from one parent portal.
            </p>
          </div>

          <section className="card-container">
            <button type="button" onClick={onOpenNotifications} className="card">
              <div className="card__title">
                <h3>Alert and Notification</h3>
              </div>
              <div className="card__thumbnail">
                <Bell className="h-10 w-10 text-blue-600" />
              </div>
              <div className="card__description">
                View exam reminders, event schedules, school circulars, and important parent updates.
              </div>
              <span className="button">Open</span>
            </button>

            <button type="button" onClick={onOpenLeaveRequest} className="card">
              <div className="card__title">
                <h3>Leave Request</h3>
              </div>
              <div className="card__thumbnail">
                <FileText className="h-10 w-10 text-green-600" />
              </div>
              <div className="card__description">
                Submit sick, personal, emergency, medical, family function, vacation, or other leave requests for mapped students.
              </div>
              <span className="button">Open</span>
            </button>

            <button type="button" onClick={onOpenPerformanceAnalysis} className="card">
              <div className="card__title">
                <h3>Performance Analysis</h3>
              </div>
              <div className="card__thumbnail">
                <TrendingUp className="h-10 w-10 text-yellow-600" />
              </div>
              <div className="card__description">
                Review your student’s exam performance and event score trends in one dashboard.
              </div>
              <span className="button">Open</span>
            </button>

            <button type="button" onClick={onOpenRegistration} className="card">
              <div className="card__title">
                <h3>Calendar Event Examination Registration</h3>
              </div>
              <div className="card__thumbnail">
                <CalendarHeart className="h-10 w-10 text-purple-600" />
              </div>
              <div className="card__description">
                Register your child for the Calendar Event Examination and continue into the student exam flow.
              </div>
              <span className="button">Open</span>
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
            <School className="h-8 w-8 text-blue-600" />
          </div>
          <p className="mb-3 text-sm font-semibold text-blue-700">BRIGHT FUTURE SCHOOL</p>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">School Home Page</h1>
          <p className="max-w-4xl text-lg leading-relaxed text-gray-600">
            Welcome to the school service portal for Calendar Event Examination, academic communication, parent updates, and student service workflows.
          </p>
          <button
            type="button"
            onClick={onOpenLogin}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <LogIn className="h-5 w-5" />
            Login to Parent Dashboard
          </button>
        </section>

        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-min">
          <div className="flex h-full min-h-[210px] flex-col justify-between rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
            <CalendarHeart className="mb-4 h-7 w-7 text-blue-600" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">Calendar Event Examination</h2>
            <p className="text-gray-600">
              Students can participate in structured event-based examinations after parent login and registration.
            </p>
          </div>
          <div className="flex h-full min-h-[210px] flex-col justify-between rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
            <Bell className="mb-4 h-7 w-7 text-green-600" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">School Notifications</h2>
            <p className="text-gray-600">
              Parents receive important announcements, reminders, exam notices, and event communication in the portal.
            </p>
          </div>
          <div className="flex h-full min-h-[210px] flex-col justify-between rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
            <BookOpen className="mb-4 h-7 w-7 text-purple-600" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">Other Services</h2>
            <p className="text-gray-600">
              The portal supports academic updates, student records, certificate access, and parent-school coordination.
            </p>
          </div>
        </section>
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

  useEffect(() => {
    if ((!authUser || !isParentUser(authUser)) && (appState === 'registration' || appState === 'notifications' || appState === 'leaveRequest')) {
      setAppState('home');
    }
  }, [authUser, appState]);

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
    setAppState('home');
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthMode(null);
    setAppState('home');
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

      {showProfile && authUser && isParentUser(authUser) && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userId={authUser.id}
        />
      )}

      {appState === 'home' && isTeacherUser(authUser) && (
        <TeacherDashboard
          teacherId={authUser.id}
          teacherName={authUser.name}
          onLogout={handleLogout}
        />
      )}

      {appState === 'home' && !isTeacherUser(authUser) && (
        <LandingPage
          onOpenRegistration={() => setAppState('registration')}
          onOpenNotifications={() => setAppState('notifications')}
          onOpenLeaveRequest={() => setAppState('leaveRequest')}
          onOpenPerformanceAnalysis={() => setAppState('performanceAnalysis')}
          onOpenLogin={() => setAuthMode('login')}
          user={authUser}
        />
      )}

      {appState === 'registration' && authUser && isParentUser(authUser) && (
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
      {appState === 'notifications' && authUser && isParentUser(authUser) && (
        <AlertNotification
          onBack={() => setAppState('home')}
          userId={authUser.id}
        />
      )}
      {appState === 'performanceAnalysis' && authUser && isParentUser(authUser) && (
        <ParentPerformanceAnalysis
          onBack={() => setAppState('home')}
          user={authUser}
        />
      )}
      {appState === 'leaveRequest' && authUser && isParentUser(authUser) && (
        <LeaveRequest
          onBack={() => setAppState('home')}
          userId={authUser.id}
        />
      )}
    </div>
  );
}
