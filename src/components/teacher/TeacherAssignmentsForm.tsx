import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherAssignmentsForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    title: '',
    dueDate: '',
    instructions: '',
  });

  const handleSubmit = () => {
    console.log('Assignment payload:', { teacherId, ...formData });
    toast.success('Assignment form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Assignments</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Class" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Assignment Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
        <textarea className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Instructions" rows={5} value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700">Create Assignment</button>
    </div>
  );
}
