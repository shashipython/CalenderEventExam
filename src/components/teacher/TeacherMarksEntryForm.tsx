import { useState } from 'react';
import { toast } from 'sonner';

interface TeacherServiceFormProps {
  teacherId: string;
}

export function TeacherMarksEntryForm({ teacherId }: TeacherServiceFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    className: '',
    subject: '',
    examName: '',
    marksObtained: '',
    totalMarks: '',
  });

  const handleSubmit = () => {
    console.log('Marks entry payload:', { teacherId, ...formData });
    toast.success('Marks entry form ready to submit.');
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Marks Entry</h2>
      <p className="mb-6 text-gray-600">Teacher ID: {teacherId}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Student ID" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Student Name" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Class" value={formData.className} onChange={(e) => setFormData({ ...formData, className: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" placeholder="Exam Name" value={formData.examName} onChange={(e) => setFormData({ ...formData, examName: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="number" placeholder="Marks Obtained" value={formData.marksObtained} onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })} />
        <input className="rounded-lg border border-gray-300 px-4 py-3" type="number" placeholder="Total Marks" value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })} />
      </div>
      <button type="button" onClick={handleSubmit} className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">Save Marks</button>
    </div>
  );
}
