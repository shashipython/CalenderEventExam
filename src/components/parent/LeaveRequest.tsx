import { useEffect, useState } from 'react';
import { API_CONFIG } from '../../config/apiConfig';

interface LeaveRequestProps {
  userId: string;
  onBack: () => void;
}

interface StudentOption {
  id: string;
  name: string;
}

type LeaveTab = 'request' | 'status' | 'policy';

interface LeaveRecord {
  leave_id: number;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason: string;
  status: string;
  applied_on: string;
  approved_on: string | null;
  rejection_reason: string | null;
  student_name: string;
  student_id: number;
}

const leaveTypes = [
  'Sick',
  'Personal',
  'Emergency',
  'Medical',
  'Family Function',
  'Vacation',
  'Other',
];

const extractStudentOptions = (payload: unknown): StudentOption[] => {
  const visited = new Set<unknown>();

  const normalizeStudent = (value: unknown, index: number): StudentOption | null => {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Record<string, unknown>;
    const firstName = candidate.first_name ?? candidate.firstName ?? '';
    const lastName = candidate.last_name ?? candidate.lastName ?? '';
    const rawName =
      firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : candidate.name ?? candidate.student_name ?? candidate.studentName ?? candidate.full_name ?? candidate.fullName;
    const rawId = candidate.id ?? candidate.student_id ?? candidate.studentId;

    if (!rawName) {
      return null;
    }

    return {
      id: String(rawId ?? `${index}-${rawName}`),
      name: String(rawName).trim(),
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
        const students = walk(nestedValue);
        if (students.length > 0) {
          return students;
        }
      }
    }

    return [];
  };

  return walk(payload);
};

export function LeaveRequest({ userId, onBack }: LeaveRequestProps) {
  const [activeTab, setActiveTab] = useState<LeaveTab>('request');
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    leaveType: 'Sick',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const pendingLeaves = leaveRecords.filter((record) => record.status.toLowerCase() === 'pending');
  const leaveHistory = leaveRecords
    .filter((record) => ['approved', 'rejected'].includes(record.status.toLowerCase()))
    .sort((a, b) => new Date(b.from_date).getTime() - new Date(a.from_date).getTime());

  useEffect(() => {
    const controller = new AbortController();

    const loadStudents = async () => {
      setLoadingStudents(true);
      setError(null);

      try {
        const response = await fetch(API_CONFIG.STUDENTS_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: Number(userId) }),
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          const apiError =
            result && typeof result === 'object'
              ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error ?? '')
              : '';
          throw new Error(apiError || `Failed to load students. Status: ${response.status}`);
        }

        const options = extractStudentOptions(result);
        setStudents(options);
        setFormData((prev) => ({
          ...prev,
          studentId: prev.studentId || options[0]?.id || '',
        }));
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setStudents([]);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load students.');
      } finally {
        if (!controller.signal.aborted) {
          setLoadingStudents(false);
        }
      }
    };

    loadStudents();

    return () => controller.abort();
  }, [userId]);

  const loadLeaveRecords = async () => {
    setLoadingLeaves(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.FETCH_LEAVE_REQUEST_PARENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: Number(userId) }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError =
          result && typeof result === 'object'
            ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error ?? '')
            : '';
        throw new Error(apiError || `Failed to load leave requests. Status: ${response.status}`);
      }

      const data =
        result && typeof result === 'object' && Array.isArray((result as Record<string, unknown>).data)
          ? ((result as Record<string, unknown>).data as LeaveRecord[])
          : [];
      setLeaveRecords(data);
    } catch (loadError) {
      setLeaveRecords([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load leave requests.');
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    loadLeaveRecords();
  }, [userId]);

  const resetForm = () => {
    setFormData({
      studentId: students[0]?.id || '',
      leaveType: 'Sick',
      fromDate: '',
      toDate: '',
      reason: '',
    });
    setEditingLeave(null);
    setMessage(null);
    setError(null);
  };

  const startEdit = (record: LeaveRecord) => {
    setEditingLeave(record);
    setFormData({
      studentId: String(record.student_id),
      leaveType: record.leave_type,
      fromDate: record.from_date,
      toDate: record.to_date,
      reason: record.reason,
    });
    setMessage(null);
    setError(null);
    setActiveTab('request');
  };

  const submitLeaveRequest = async () => {
    setMessage(null);
    setError(null);

    if (!formData.studentId) {
      setError('Please select a student.');
      return;
    }

    if (!formData.fromDate || !formData.toDate) {
      setError('Please select both from date and to date.');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Please enter the reason for leave.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...(editingLeave ? { leave_id: editingLeave.leave_id } : {}),
        student_id: Number(formData.studentId),
        leave_type: formData.leaveType,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        reason: formData.reason.trim(),
      };

      const response = await fetch(editingLeave ? API_CONFIG.UPDATE_LEAVE_REQUEST_URL : API_CONFIG.LEAVE_REQUEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError =
          result && typeof result === 'object'
            ? String((result as Record<string, unknown>).message ?? (result as Record<string, unknown>).error ?? '')
            : '';
        throw new Error(apiError || `Leave request failed. Status: ${response.status}`);
      }

      setMessage(
        result && typeof result === 'object' && (result as Record<string, unknown>).message
          ? String((result as Record<string, unknown>).message)
          : editingLeave
            ? 'Request updated successfully'
            : 'Request submitted successfully'
      );
      setEditingLeave(null);
      setFormData((prev) => ({ ...prev, fromDate: '', toDate: '', reason: '' }));
      await loadLeaveRecords();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : editingLeave ? 'Unable to update leave request.' : 'Unable to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabClass = (tab: LeaveTab) =>
    `px-4 py-3 font-semibold ${
      activeTab === tab ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600'
    }`;

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
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Leave Request</h1>
          <p className="mb-6 text-gray-600">Submit and manage student leave requests.</p>

          <div className="mb-6 flex flex-wrap border-b border-gray-200">
            <button type="button" onClick={() => setActiveTab('request')} className={tabClass('request')}>
              Leave Request
            </button>
            <button type="button" onClick={() => setActiveTab('status')} className={tabClass('status')}>
              Request Status
            </button>
            <button type="button" onClick={() => setActiveTab('policy')} className={tabClass('policy')}>
              Leave History
            </button>
          </div>

          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {activeTab === 'request' && (
            <div className="grid gap-5 md:grid-cols-2">
              {editingLeave && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800 md:col-span-2">
                  Editing pending leave request #{editingLeave.leave_id}. Update the details and click Update.
                </div>
              )}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">Name</label>
                <select
                  value={formData.studentId}
                  onChange={(event) => setFormData({ ...formData, studentId: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  disabled={loadingStudents}
                >
                  <option value="">{loadingStudents ? 'Loading students...' : 'Select student'}</option>
                  {editingLeave && !students.some((student) => student.id === String(editingLeave.student_id)) && (
                    <option value={String(editingLeave.student_id)}>{editingLeave.student_name}</option>
                  )}
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(event) => setFormData({ ...formData, leaveType: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                >
                  {editingLeave && !leaveTypes.includes(formData.leaveType) && (
                    <option value={formData.leaveType}>{formData.leaveType}</option>
                  )}
                  {leaveTypes.map((leaveType) => (
                    <option key={leaveType} value={leaveType}>
                      {leaveType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">From Date</label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(event) => setFormData({ ...formData, fromDate: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">To Date</label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(event) => setFormData({ ...formData, toDate: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">Reason for Leave</label>
                <textarea
                  value={formData.reason}
                  onChange={(event) => setFormData({ ...formData, reason: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  rows={5}
                  placeholder="Enter reason for leave"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={submitLeaveRequest}
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (editingLeave ? 'Updating...' : 'Submitting...') : editingLeave ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div>
              {loadingLeaves ? (
                <div className="rounded-xl bg-gray-50 p-6 text-gray-700">Loading pending leave requests...</div>
              ) : pendingLeaves.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-gray-700">No pending leave requests found.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-left text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Leave Type</th>
                        <th className="px-4 py-3 font-semibold">From</th>
                        <th className="px-4 py-3 font-semibold">To</th>
                        <th className="px-4 py-3 font-semibold">Days</th>
                        <th className="px-4 py-3 font-semibold">Reason</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {pendingLeaves.map((record) => (
                        <tr key={record.leave_id}>
                          <td className="px-4 py-3">{record.student_name}</td>
                          <td className="px-4 py-3">{record.leave_type}</td>
                          <td className="px-4 py-3">{record.from_date}</td>
                          <td className="px-4 py-3">{record.to_date}</td>
                          <td className="px-4 py-3">{record.days}</td>
                          <td className="max-w-xs px-4 py-3">{record.reason}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(record)}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMessage(null);
                                  setError('Delete API is not configured yet.');
                                }}
                                className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'policy' && (
            <div>
              {loadingLeaves ? (
                <div className="rounded-xl bg-gray-50 p-6 text-gray-700">Loading leave history...</div>
              ) : leaveHistory.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-6 text-gray-700">No approved or rejected leave history found.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-left text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Student</th>
                        <th className="px-4 py-3 font-semibold">Leave Type</th>
                        <th className="px-4 py-3 font-semibold">From</th>
                        <th className="px-4 py-3 font-semibold">To</th>
                        <th className="px-4 py-3 font-semibold">Days</th>
                        <th className="px-4 py-3 font-semibold">Reason</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Applied On</th>
                        <th className="px-4 py-3 font-semibold">Approved On</th>
                        <th className="px-4 py-3 font-semibold">Rejection Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {leaveHistory.map((record) => (
                        <tr key={record.leave_id}>
                          <td className="px-4 py-3">{record.student_name}</td>
                          <td className="px-4 py-3">{record.leave_type}</td>
                          <td className="px-4 py-3">{record.from_date}</td>
                          <td className="px-4 py-3">{record.to_date}</td>
                          <td className="px-4 py-3">{record.days}</td>
                          <td className="max-w-xs px-4 py-3">{record.reason}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                record.status.toLowerCase() === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{record.applied_on}</td>
                          <td className="px-4 py-3">{record.approved_on || '-'}</td>
                          <td className="px-4 py-3">{record.rejection_reason || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
