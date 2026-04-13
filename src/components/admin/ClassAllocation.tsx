import { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

export function ClassAllocation() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');

  useEffect(() => {
    loadStudents();
    initializeClasses();
  }, []);

  const loadStudents = () => {
    const data = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(data);
  };

  const initializeClasses = () => {
    const existingClasses = JSON.parse(localStorage.getItem('classes') || '[]');
    if (existingClasses.length === 0) {
      const defaultClasses = [
        { id: '1', grade: '5', section: 'A', studentCount: 0 },
        { id: '2', grade: '5', section: 'B', studentCount: 0 },
        { id: '3', grade: '6', section: 'A', studentCount: 0 },
        { id: '4', grade: '6', section: 'B', studentCount: 0 }
      ];
      localStorage.setItem('classes', JSON.stringify(defaultClasses));
    }
  };

  const allocateStudent = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.map(s =>
      s.id === selectedStudent ? { ...s, section: selectedSection } : s
    );
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));

    // Update class count
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    const student = students.find(s => s.id === selectedStudent);
    if (student) {
      const updatedClasses = classes.map((c: any) => {
        if (c.grade === student.grade && c.section === selectedSection) {
          return { ...c, studentCount: c.studentCount + 1 };
        }
        return c;
      });
      localStorage.setItem('classes', JSON.stringify(updatedClasses));
    }

    setSelectedStudent('');
  };

  const unallocatedStudents = students.filter(s => !s.section || s.section === 'A');
  const classCounts = students.reduce((acc: any, student) => {
    const key = `${student.grade}-${student.section}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Class Allocation</h2>
        <p className="text-gray-600 text-sm">Assign students to classes and sections</p>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-2 gap-3">
        {['5-A', '5-B', '6-A', '6-B'].map((classKey) => (
          <div key={classKey} className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-gray-900 mb-1">Grade {classKey}</div>
            <div className="text-2xl text-purple-600">{classCounts[classKey] || 0}</div>
            <div className="text-gray-600 text-xs">Students</div>
          </div>
        ))}
      </div>

      {/* Allocation Form */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <h3 className="text-gray-900">Allocate Student</h3>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Select Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choose student</option>
            {unallocatedStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - Grade {student.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        <button
          onClick={allocateStudent}
          disabled={!selectedStudent}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Allocate to Class
        </button>
      </div>

      {/* Student List */}
      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-3">All Students</h3>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-gray-900">{student.name}</div>
                  <div className="text-gray-600 text-xs">Grade {student.grade}</div>
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Section {student.section}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
