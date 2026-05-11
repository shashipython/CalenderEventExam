import { useEffect, useMemo, useState } from 'react';
import StudentSelector from './StudentSelector';
import PerformanceChart from './PerformanceChart';
import { API_CONFIG } from '../config/apiConfig';

interface ParentPerformanceAnalysisProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onBack: () => void;
}

interface StudentOption {
  id: number;
  label: string;
}

interface GraphRow {
  event_title?: string;
  percentage?: number;
  student_name?: string;
}

const GRAPH_API_URL = 'https://z8q5mxrebl.execute-api.us-east-1.amazonaws.com/default/event_get_student_score_details_graph';

export default function ParentPerformanceAnalysis({ user, onBack }: ParentPerformanceAnalysisProps) {
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [rawData, setRawData] = useState<GraphRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadStudents = async () => {
      if (!user?.id) {
        setStudentOptions([]);
        return;
      }

      try {
        const response = await fetch(API_CONFIG.STUDENTS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: Number(user.id) }),
          signal: controller.signal,
        });

        const result = await response.json().catch(() => null);
        console.log('Parent performance students response:', result);

        const options: StudentOption[] = [];

        if (Array.isArray(result)) {
          result.forEach((student: any) => {
            const id = Number(student.id ?? student.student_id ?? student.studentId ?? student.user_id);
            const label =
              student.name ||
              student.student_name ||
              student.studentName ||
              `${student.first_name ?? student.firstName ?? ''} ${student.last_name ?? student.lastName ?? ''}`.trim() ||
              `Student ${id}`;
            if (!Number.isNaN(id)) {
              options.push({ id, label: label || `Student ${id}` });
            }
          });
        } else if (result && typeof result === 'object') {
          const items = Array.isArray((result as any).data)
            ? (result as any).data
            : Array.isArray((result as any).items)
            ? (result as any).items
            : Array.isArray((result as any).students)
            ? (result as any).students
            : [];

          items.forEach((student: any) => {
            const id = Number(student.id ?? student.student_id ?? student.studentId ?? student.user_id);
            const label =
              student.name ||
              student.student_name ||
              student.studentName ||
              `${student.first_name ?? student.firstName ?? ''} ${student.last_name ?? student.lastName ?? ''}`.trim() ||
              `Student ${id}`;
            if (!Number.isNaN(id)) {
              options.push({ id, label: label || `Student ${id}` });
            }
          });
        }

        if (options.length > 0) {
          setStudentOptions(options);
          setSelectedUserId((prev) => (options.some((item) => item.id === prev) ? prev : options[0].id));
        } else {
          setStudentOptions([]);
          setSelectedUserId(Number(user.id) || 0);
        }
      } catch (err) {
        console.error(err);
        setStudentOptions([]);
      }
    };

    loadStudents();

    return () => controller.abort();
  }, [user.id]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(GRAPH_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: selectedUserId }),
          signal: controller.signal,
        });

        const result = await response.json().catch(() => null);
        console.log('RAW API RESPONSE:', JSON.stringify(result, null, 2));

        let data = result?.data ?? result?.items ?? result;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if (Array.isArray(data.data)) {
            data = data.data;
          } else if (Array.isArray(data.items)) {
            data = data.items;
          }
        }

        if (!Array.isArray(data)) {
          console.error('Expected array but got:', data);
          setError('API did not return an array of performance data.');
          setRawData([]);
          setLoading(false);
          return;
        }

        setRawData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch performance data.');
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUserId) {
      fetchData();
    } else {
      setLoading(false);
      setRawData([]);
    }

    return () => controller.abort();
  }, [selectedUserId]);

  const formattedData = useMemo(
    () =>
      rawData
        .filter((item) => item.event_title)
        .map((item) => ({
          event_title: item.event_title ?? '',
          percentage: Number(item.percentage ?? 0),
        })),
    [rawData]
  );

  const studentName = rawData[0]?.student_name || 'Student';

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to Parent Dashboard
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Performance Analysis</h1>
          <p className="mb-6 text-gray-600">
            Use the selector below to view your student's report card and event score trends.
          </p>

          <div className="space-y-6">
            <StudentSelector
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              options={studentOptions}
            />

            {loading && (
              <div className="rounded-xl bg-gray-50 p-6 text-gray-700">Loading performance data...</div>
            )}

            {error && (
              <div className="rounded-xl bg-rose-50 p-6 text-rose-700">{error}</div>
            )}

            {!loading && !error && formattedData.length === 0 && (
              <div className="rounded-xl bg-gray-50 p-6 text-gray-700">
                No performance data available for the selected student.
              </div>
            )}

            {!loading && !error && formattedData.length > 0 && (
              <PerformanceChart data={formattedData} studentName={studentName} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
