import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherAttendanceForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    attendanceDate: '',
    presentCount: '',
    absentCount: '',
    remarks: '',
  });

  const handleSubmit = () => {
    console.log('Attendance payload:', { teacherId, ...formData });
    toast.success('Attendance form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Attendance</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Class" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Section" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="date" value={formData.attendanceDate} onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="number" placeholder="Present Count" value={formData.presentCount} onChange={(e) => setFormData({ ...formData, presentCount: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="number" placeholder="Absent Count" value={formData.absentCount} onChange={(e) => setFormData({ ...formData, absentCount: e.target.value })} />
        <textarea className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Remarks" rows={4} value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Submit Attendance</button>
    </div>
  );
}
