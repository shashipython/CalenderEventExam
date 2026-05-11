import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherLeaveApprovalForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    leaveFrom: '',
    leaveTo: '',
    decision: 'approved',
    remarks: '',
  });

  const handleSubmit = () => {
    console.log('Leave approval payload:', { teacherId, ...formData });
    toast.success('Leave approval form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Leave Approval</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Student Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="date" value={formData.leaveFrom} onChange={(e) => setFormData({ ...formData, leaveFrom: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="date" value={formData.leaveTo} onChange={(e) => setFormData({ ...formData, leaveTo: e.target.value })} />
        <select className="rounded-lg border border-gray-300 px-4 py-3" value={formData.decision} onChange={(e) => setFormData({ ...formData, decision: e.target.value })}>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
        <textarea className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Remarks" rows={4} value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">Submit Decision</button>
    </div>
  );
}
