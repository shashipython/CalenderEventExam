import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { Student } from '../App';

interface RegistrationProps {
  onComplete: (student: Student) => void;
  onBack: () => void;
  user: { id: string; name: string; email: string } | null;
}

interface EventOption {
  id: string;
  title: string;
}

interface StudentOption {
  id: string;
  name: string;
}

const EVENT_TITLES_API_URL = '/api/event_get_event_title';
const STUDENTS_API_URL = '/api/event_get_students';

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateValue = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const trimmedValue = value.trim();
  const matchedDate = trimmedValue.match(/\d{4}-\d{2}-\d{2}/);

  if (matchedDate) {
    return matchedDate[0];
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return formatDateForInput(parsedDate);
};

const extractEventOptions = (payload: unknown, selectedDate: string): EventOption[] => {
  const visited = new Set<unknown>();

  const normalizeEvent = (value: unknown, index: number): EventOption | null => {
    if (typeof value === 'string') {
      const title = value.trim();
      return title ? { id: `${index}-${title}`, title } : null;
    }

    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Record<string, unknown>;
    const rawTitle =
      candidate.title ??
      candidate.event_title ??
      candidate.eventTitle ??
      candidate.name ??
      candidate.event_name ??
      candidate.eventName;

    if (typeof rawTitle !== 'string' || !rawTitle.trim()) {
      return null;
    }

    const rawDate =
      candidate.event_date ??
      candidate.eventDate ??
      candidate.date ??
      candidate.start_date ??
      candidate.startDate;

    const normalizedDate = normalizeDateValue(rawDate);

    if (normalizedDate && normalizedDate !== selectedDate) {
      return null;
    }

    const rawId = candidate.id ?? candidate.event_id ?? candidate.eventId ?? rawTitle;
    return {
      id: String(rawId),
      title: rawTitle.trim(),
    };
  };

  const walk = (value: unknown): EventOption[] => {
    if (!value || visited.has(value)) {
      return [];
    }

    if (typeof value === 'object') {
      visited.add(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item, index) => normalizeEvent(item, index))
        .filter((item): item is EventOption => Boolean(item));
    }

    if (typeof value === 'object') {
      for (const nestedValue of Object.values(value as Record<string, unknown>)) {
        const options = walk(nestedValue);
        if (options.length > 0) {
          return options;
        }
      }
    }

    return [];
  };

  return walk(payload);
};

const extractStudentOptions = (payload: unknown): StudentOption[] => {
  const visited = new Set<unknown>();

  const normalizeStudent = (value: unknown, index: number): StudentOption | null => {
    if (typeof value === 'string') {
      const name = value.trim();
      return name ? { id: `${index}-${name}`, name } : null;
    }

    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Record<string, unknown>;
    
    // Handle first_name + last_name combination
    const firstName = candidate.first_name ?? candidate.firstName ?? candidate.first_name ?? '';
    const lastName = candidate.last_name ?? candidate.lastName ?? candidate.last_name ?? '';
    
    let rawName: string | undefined;
    if (firstName && lastName) {
      rawName = `${firstName} ${lastName}`.trim();
    } else if (firstName) {
      rawName = String(firstName);
    } else {
      rawName = 
        candidate.name ??
        candidate.student_name ??
        candidate.studentName ??
        candidate.full_name ??
        candidate.fullName;
    }

    if (typeof rawName !== 'string' || !rawName.trim()) {
      return null;
    }

    const rawId =
      candidate.id ??
      candidate.student_id ??
      candidate.studentId ??
      candidate.user_id;

    return {
      id: String(rawId ?? `${index}-${rawName}`),
      name: rawName.trim(),
    };
  };

  const walk = (value: unknown): StudentOption[] => {
    if (!value || visited.has(value)) {
      return [];
    }

    if (typeof value === 'object') {
      visited.add(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item, index) => normalizeStudent(item, index))
        .filter((item): item is StudentOption => Boolean(item));
    }

    if (typeof value === 'object') {
      for (const nestedValue of Object.values(value as Record<string, unknown>)) {
        const options = walk(nestedValue);
        if (options.length > 0) {
          return options;
        }
      }
    }

    return [];
  };

  return walk(payload);
};

export function Registration({ onComplete, onBack, user }: RegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email ?? '',
    age: '',
    category: '' as '' | 'primary' | 'highschool',
    schoolName: '',
    eventDate: formatDateForInput(new Date()),
    eventId: '',
    grade: '',
    studentId: '',
  });
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      setStudentOptions([]);
      return;
    }

    const controller = new AbortController();

    const loadStudents = async () => {
      setIsLoadingStudents(true);

      try {
        const response = await fetch(STUDENTS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: Number(user.id),
          }),
          signal: controller.signal,
        });

        const result = await response.json().catch(() => null);

        // Debug: Log the API response to see the structure
        console.log('Students API response:', result);
        console.log('User ID being sent:', user.id);

        if (!response.ok) {
          const errorMessage =
            (result && typeof result === 'object' && ('message' in result || 'error' in result)
              ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error)
              : '') || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const extracted = extractStudentOptions(result);
        console.log('Extracted student options:', extracted);
        setStudentOptions(extracted);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Error loading students:', error);
        setStudentOptions([]);
        toast.error(error instanceof Error ? error.message : 'Unable to load student names.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingStudents(false);
        }
      }
    };

    loadStudents();

    return () => {
      controller.abort();
    };
  }, [user?.id]);

  useEffect(() => {
    const controller = new AbortController();

    const loadEvents = async () => {
      setIsLoadingEvents(true);

      try {
        const url = new URL(EVENT_TITLES_API_URL, window.location.origin);
        url.searchParams.set('event_date', formData.eventDate);

        const response = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            (result && typeof result === 'object' && ('message' in result || 'error' in result)
              ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error)
              : '') || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const options = extractEventOptions(result, formData.eventDate);
        setEventOptions(options);
        setFormData((prev) => ({
          ...prev,
          eventId: options.some((option) => option.id === prev.eventId) ? prev.eventId : '',
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Error loading event titles:', error);
        setEventOptions([]);
        setFormData((prev) => ({ ...prev, eventId: '' }));
        toast.error(error instanceof Error ? error.message : 'Unable to load events for the selected date.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingEvents(false);
        }
      }
    };

    loadEvents();

    return () => {
      controller.abort();
    };
  }, [formData.eventDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age, 10) < 5 || parseInt(formData.age, 10) > 20) {
      newErrors.age = 'Age must be between 5 and 20';
    }
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventId) newErrors.eventId = 'Please select an event';
    if (!formData.grade.trim()) newErrors.grade = 'Grade is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const student: Student = {
        id: formData.studentId || `STU${Date.now()}`,
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age, 10),
        category: formData.category,
        schoolName: formData.schoolName,
        grade: formData.grade,
        eventId: formData.eventId,
      };

      onComplete(student);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Summer Camp Examination Portal</h1>
          <p className="text-lg text-gray-600">Register for Event Story and begin your online examination</p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-blue-200 bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Primary School</h3>
            </div>
            <p className="mb-2 text-gray-700">Age: 5-12 years</p>
            <p className="text-sm text-gray-600">Exciting stories with multiple choice questions to test your comprehension and imagination!</p>
          </div>

          <div className="rounded-xl border-2 border-purple-200 bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-900">High School</h3>
            </div>
            <p className="mb-2 text-gray-700">Age: 13-18 years</p>
            <p className="text-sm text-gray-600">Inspiring stories of patriotic heroes with thought-provoking questions on their contributions!</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Student Registration</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const selectedStudent = studentOptions.find(s => s.name === e.target.value);
                    setFormData({ 
                      ...formData, 
                      name: e.target.value,
                      studentId: selectedStudent?.id || ''
                    });
                  }}
                  disabled={isLoadingStudents}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingStudents
                      ? 'Loading student names...'
                      : studentOptions.length > 0
                        ? 'Select student name'
                        : 'No students available'}
                  </option>
                  {studentOptions.map((student) => (
                    <option key={student.id} value={student.name}>
                      {student.name}
                    </option>
                  ))}
                </select>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
                  min="5"
                  max="20"
                />
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Examination Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'primary' | 'highschool' })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="primary">Primary School</option>
                  <option value="highschool">High School</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  School Name *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your school name"
                />
                {errors.schoolName && <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
                {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event *
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  disabled={isLoadingEvents || eventOptions.length === 0}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {isLoadingEvents
                      ? 'Loading events...'
                      : eventOptions.length > 0
                        ? 'Select event'
                        : 'No events available'}
                  </option>
                  {eventOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
                {errors.eventId && <p className="mt-1 text-sm text-red-600">{errors.eventId}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Grade/Class *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select grade</option>
                  {Array.from({ length: 9 }, (_, index) => index + 2).map((grade) => (
                    <option key={grade} value={grade.toString()}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please ensure all information is accurate. You'll need to complete the examination in one session. Results and certificate will be available immediately after completion.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700"
            >
              Register & Start Examination
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
