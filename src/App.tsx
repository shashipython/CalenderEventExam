import { useState } from 'react';
import { Registration } from './components/Registration';
import { ExamInterface } from './components/ExamInterface';
import { Results } from './components/Results';
import { Certificate } from './components/Certificate';

export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  category: 'primary' | 'highschool';
  schoolName: string;
  grade: string;
}

export interface ExamResult {
  studentId: string;
  category: 'primary' | 'highschool';
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<number, string>;
  completedAt: string;
}

type AppState = 'registration' | 'exam' | 'results' | 'certificate';

export default function App() {
  const [appState, setAppState] = useState<AppState>('registration');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleRegistrationComplete = (student: Student) => {
    setCurrentStudent(student);
    setAppState('exam');
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
    setAppState('results');
  };

  const handleViewCertificate = () => {
    setAppState('certificate');
  };

  const handleStartNew = () => {
    setCurrentStudent(null);
    setExamResult(null);
    setAppState('registration');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {appState === 'registration' && (
        <Registration onComplete={handleRegistrationComplete} />
      )}
      
      {appState === 'exam' && currentStudent && (
        <ExamInterface 
          student={currentStudent} 
          onComplete={handleExamComplete} 
        />
      )}
      
      {appState === 'results' && currentStudent && examResult && (
        <Results 
          student={currentStudent}
          result={examResult}
          onViewCertificate={handleViewCertificate}
          onStartNew={handleStartNew}
        />
      )}
      
      {appState === 'certificate' && currentStudent && examResult && (
        <Certificate 
          student={currentStudent}
          result={examResult}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
}
