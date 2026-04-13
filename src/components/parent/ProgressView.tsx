import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface SubjectProgress {
  subject: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
}

export function ProgressView() {
  const [progressData, setProgressData] = useState<SubjectProgress[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    // Load from daily reports and calculate progress
    const allReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
    const subjectMap = new Map<string, Set<string>>();

    allReports.forEach((report: any) => {
      report.subjects?.forEach((subject: any) => {
        if (!subjectMap.has(subject.name)) {
          subjectMap.set(subject.name, new Set());
        }
        const topics = subjectMap.get(subject.name);
        subject.topicsCovered?.forEach((topic: string) => {
          topics?.add(topic);
        });
      });
    });

    const progress: SubjectProgress[] = Array.from(subjectMap.entries()).map(([subject, topics]) => {
      const completed = topics.size;
      const total = Math.max(completed, 20); // Assuming 20 topics per subject
      return {
        subject,
        totalTopics: total,
        completedTopics: completed,
        percentage: Math.round((completed / total) * 100)
      };
    });

    setProgressData(progress);
  };

  const overallProgress = progressData.length > 0
    ? Math.round(
        progressData.reduce((sum, p) => sum + p.percentage, 0) / progressData.length
      )
    : 0;

  if (progressData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 mb-2">No Progress Data</h3>
        <p className="text-gray-600 text-sm">
          Progress tracking will appear here once classes begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-white">Overall Progress</h2>
            <p className="text-purple-100 text-sm">Academic Performance</p>
          </div>
        </div>
        
        <div className="flex items-end gap-2 mb-2">
          <div className="text-4xl">{overallProgress}%</div>
          <div className="text-purple-100 mb-2">Complete</div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-gray-900 mb-4">Subject Progress</h3>
        
        <div className="space-y-4">
          {progressData.map((subject, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-900">{subject.subject}</span>
                </div>
                <div className={`text-lg ${
                  subject.percentage >= 80 ? 'text-green-600' :
                  subject.percentage >= 60 ? 'text-blue-600' :
                  subject.percentage >= 40 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {subject.percentage}%
                </div>
              </div>
              
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      subject.percentage >= 80 ? 'bg-green-600' :
                      subject.percentage >= 60 ? 'bg-blue-600' :
                      subject.percentage >= 40 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{subject.completedTopics} topics completed</span>
                <span>{subject.totalTopics - subject.completedTopics} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Badge */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-gray-900 mb-3">Performance Badge</h3>
        <div className="text-center py-4">
          {overallProgress >= 90 ? (
            <div>
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-green-600">Excellent Performance!</div>
              <p className="text-gray-600 text-sm mt-1">Keep up the great work!</p>
            </div>
          ) : overallProgress >= 75 ? (
            <div>
              <div className="text-6xl mb-2">⭐</div>
              <div className="text-blue-600">Great Progress!</div>
              <p className="text-gray-600 text-sm mt-1">You&apos;re doing well!</p>
            </div>
          ) : overallProgress >= 50 ? (
            <div>
              <div className="text-6xl mb-2">💪</div>
              <div className="text-yellow-600">Good Effort!</div>
              <p className="text-gray-600 text-sm mt-1">Keep pushing forward!</p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-2">📚</div>
              <div className="text-orange-600">Keep Learning!</div>
              <p className="text-gray-600 text-sm mt-1">Stay focused on your studies!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
