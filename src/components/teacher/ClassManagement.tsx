import { useState, useEffect } from 'react';
import { Users, BookOpen } from 'lucide-react';

interface Class {
  id: string;
  grade: string;
  section: string;
  studentCount: number;
}

interface Subject {
  id: string;
  name: string;
  type: 'core' | 'elective';
}

export function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load classes
    const classData = JSON.parse(localStorage.getItem('classes') || '[]');
    setClasses(classData);

    // Load subjects
    const subjectData = JSON.parse(localStorage.getItem('subjects') || '[]');
    setSubjects(subjectData);
  };

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 mb-2">No Classes Assigned</h3>
        <p className="text-gray-600 text-sm">
          Your classes will appear here once assigned by the admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">My Classes</h2>
        <p className="text-gray-600 text-sm">View your assigned classes and subjects</p>
      </div>

      {/* Classes */}
      <div className="space-y-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900">Grade {classItem.grade} - {classItem.section}</h3>
                  <p className="text-gray-600 text-sm">{classItem.studentCount} Students</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      {subjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-3">My Subjects</h3>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{subject.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  subject.type === 'core'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {subject.type === 'core' ? 'Core' : 'Elective'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
