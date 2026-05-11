import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherSubjectsClassesForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    subject: '',
    className: '',
    section: '',
    schedule: '',
    roomNo: '',
  });

  const handleSubmit = () => {
    console.log('Subjects and classes payload:', { teacherId, ...formData });
    toast.success('Subjects and classes form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Subjects & Classes</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Class" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Section" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Schedule" value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Room Number" value={formData.roomNo} onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700">Save Mapping</button>
    </div>
  );
}
