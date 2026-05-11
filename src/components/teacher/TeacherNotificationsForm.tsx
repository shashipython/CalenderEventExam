import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherNotificationsForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    audience: 'class',
    className: '',
    title: '',
    message: '',
  });

  const handleSubmit = () => {
    console.log('Notification payload:', { teacherId, ...formData });
    toast.success('Notification form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Notifications</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <select className="rounded-lg border border-gray-300 px-4 py-3" value={formData.audience} onChange={(e) => setFormData({ ...formData, audience: e.target.value })}>
          <option value="class">Class</option>
          <option value="parents">Parents</option>
          <option value="students">Students</option>
        </select>
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Class / Section" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Notification Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <textarea className="rounded-lg border border-gray-300 px-4 py-3 md:col-span-2" placeholder="Message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white hover:bg-yellow-700">Send Notification</button>
    </div>
  );
}
