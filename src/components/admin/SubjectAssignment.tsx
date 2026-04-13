import { useState, useEffect } from 'react';
import { BookOpen, UserPlus } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  type: 'core' | 'elective';
  teacher: string;
  grade: string;
}

export function SubjectAssignment() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'core' as 'core' | 'elective',
    teacher: '',
    grade: '5'
  });

  useEffect(() => {
    loadSubjects();
    initializeSubjects();
  }, []);

  const loadSubjects = () => {
    const data = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjects(data);
  };

  const initializeSubjects = () => {
    const existingSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    if (existingSubjects.length === 0) {
      const defaultSubjects = [
        { id: '1', name: 'Mathematics', type: 'core', teacher: 'Mr. Smith', grade: '5' },
        { id: '2', name: 'Science', type: 'core', teacher: 'Mrs. Johnson', grade: '5' },
        { id: '3', name: 'English', type: 'core', teacher: 'Ms. Davis', grade: '5' },
        { id: '4', name: 'Art', type: 'elective', teacher: 'Mr. Wilson', grade: '5' }
      ];
      localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
      setSubjects(defaultSubjects);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSubject: Subject = {
      id: Date.now().toString(),
      ...formData
    };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    setShowForm(false);
    setFormData({ name: '', type: 'core', teacher: '', grade: '5' });
  };

  const coreSubjects = subjects.filter(s => s.type === 'core');
  const electiveSubjects = subjects.filter(s => s.type === 'elective');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Subject Assignment</h2>
        <p className="text-gray-600 text-sm">Manage subjects and assign teachers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg shadow-md p-4 text-center border border-blue-200">
          <div className="text-blue-700 text-sm mb-1">Core Subjects</div>
          <div className="text-2xl text-blue-700">{coreSubjects.length}</div>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-md p-4 text-center border border-purple-200">
          <div className="text-purple-700 text-sm mb-1">Elective Subjects</div>
          <div className="text-2xl text-purple-700">{electiveSubjects.length}</div>
        </div>
      </div>

      {/* Add Subject Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Subject
        </button>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-4">Add New Subject</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">Subject Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Mathematics"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'core' | 'elective' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="core">Core</option>
                <option value="elective">Elective</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Teacher Name</label>
              <input
                type="text"
                required
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Mr. Smith"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', type: 'core', teacher: '', grade: '5' });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Core Subjects */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-gray-900 mb-3">Core Subjects</h3>
        <div className="space-y-2">
          {coreSubjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-gray-900">{subject.name}</div>
                  <div className="text-gray-600 text-xs">Grade {subject.grade}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900 text-sm">{subject.teacher}</div>
                <div className="text-gray-500 text-xs">Teacher</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elective Subjects */}
      {electiveSubjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-3">Elective Subjects</h3>
          <div className="space-y-2">
            {electiveSubjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-gray-900">{subject.name}</div>
                    <div className="text-gray-600 text-xs">Grade {subject.grade}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 text-sm">{subject.teacher}</div>
                  <div className="text-gray-500 text-xs">Teacher</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
