import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Save } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

interface AttendanceStatus {
  studentId: string;
  status: 'present' | 'absent';
}

export function AttendanceManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceStatus[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  const loadStudents = () => {
    const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const filteredStudents = selectedClass
      ? allStudents.filter((s: Student) => `${s.grade}-${s.section}` === selectedClass)
      : allStudents;
    
    setStudents(filteredStudents);
    
    // Initialize attendance
    const initialAttendance = filteredStudents.map((s: Student) => ({
      studentId: s.id,
      status: 'present' as const
    }));
    setAttendance(initialAttendance);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev =>
      prev.map(a =>
        a.studentId === studentId
          ? { ...a, status: a.status === 'present' ? 'absent' : 'present' }
          : a
      )
    );
  };

  const saveAttendance = () => {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    
    students.forEach(student => {
      const status = attendance.find(a => a.studentId === student.id);
      attendanceRecords.push({
        studentId: student.id,
        studentName: student.name,
        date: selectedDate,
        status: status?.status || 'present'
      });
    });
    
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    total: students.length
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-3">Mark Attendance</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              <option value="5-A">Grade 5 - A</option>
              <option value="5-B">Grade 5 - B</option>
              <option value="6-A">Grade 6 - A</option>
              <option value="6-B">Grade 6 - B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg shadow-md p-3 text-center">
            <div className="text-gray-600 text-xs mb-1">Total</div>
            <div className="text-xl text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-3 text-center border border-green-200">
            <div className="text-green-700 text-xs mb-1">Present</div>
            <div className="text-xl text-green-700">{stats.present}</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-3 text-center border border-red-200">
            <div className="text-red-700 text-xs mb-1">Absent</div>
            <div className="text-xl text-red-700">{stats.absent}</div>
          </div>
        </div>
      )}

      {/* Student List */}
      {students.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-gray-900 mb-3">Students</h3>
          <div className="space-y-2">
            {students.map((student) => {
              const status = attendance.find(a => a.studentId === student.id);
              return (
                <div
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    status?.status === 'present'
                      ? 'bg-green-50 border-2 border-green-300'
                      : 'bg-red-50 border-2 border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {status?.status === 'present' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <div className="text-gray-900">{student.name}</div>
                      <div className="text-gray-600 text-xs">
                        Grade {student.grade} - {student.section}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    status?.status === 'present'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {status?.status === 'present' ? 'Present' : 'Absent'}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={saveAttendance}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved!' : 'Save Attendance'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2">No Students Found</h3>
          <p className="text-gray-600 text-sm">
            Select a class to mark attendance.
          </p>
        </div>
      )}
    </div>
  );
}
