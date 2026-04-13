import { useState } from 'react';
import { BookOpen, Plus, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export function TopicTracking() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState<'core' | 'elective'>('core');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const subjects = [
    { name: 'Mathematics', type: 'core' },
    { name: 'Science', type: 'core' },
    { name: 'English', type: 'core' },
    { name: 'Social Studies', type: 'core' },
    { name: 'Art', type: 'elective' },
    { name: 'Music', type: 'elective' },
    { name: 'Physical Education', type: 'elective' }
  ];

  const handleAddTopic = () => {
    if (!newTopicName.trim() || !selectedSubject) return;

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName,
      status: 'planned'
    };

    setTopics([...topics, newTopic]);
    setNewTopicName('');
    setShowAddForm(false);

    // Save to localStorage
    const topicsData = JSON.parse(localStorage.getItem('topicsTracking') || '{}');
    const key = `${selectedSubject}-${selectedType}`;
    topicsData[key] = [...(topicsData[key] || []), newTopic];
    localStorage.setItem('topicsTracking', JSON.stringify(topicsData));
  };

  const updateTopicStatus = (topicId: string, newStatus: 'completed' | 'in-progress' | 'planned') => {
    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, status: newStatus } : t))
    );

    // Update in localStorage
    const topicsData = JSON.parse(localStorage.getItem('topicsTracking') || '{}');
    const key = `${selectedSubject}-${selectedType}`;
    if (topicsData[key]) {
      topicsData[key] = topicsData[key].map((t: Topic) =>
        t.id === topicId ? { ...t, status: newStatus } : t
      );
      localStorage.setItem('topicsTracking', JSON.stringify(topicsData));
    }
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));

    // Remove from localStorage
    const topicsData = JSON.parse(localStorage.getItem('topicsTracking') || '{}');
    const key = `${selectedSubject}-${selectedType}`;
    if (topicsData[key]) {
      topicsData[key] = topicsData[key].filter((t: Topic) => t.id !== topicId);
      localStorage.setItem('topicsTracking', JSON.stringify(topicsData));
    }
  };

  const loadTopics = (subject: string, type: 'core' | 'elective') => {
    const topicsData = JSON.parse(localStorage.getItem('topicsTracking') || '{}');
    const key = `${subject}-${type}`;
    setTopics(topicsData[key] || []);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    const subjectData = subjects.find(s => s.name === subject);
    if (subjectData) {
      setSelectedType(subjectData.type as 'core' | 'elective');
      loadTopics(subject, subjectData.type as 'core' | 'elective');
    }
  };

  const stats = {
    completed: topics.filter(t => t.status === 'completed').length,
    inProgress: topics.filter(t => t.status === 'in-progress').length,
    planned: topics.filter(t => t.status === 'planned').length
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-3">Topic Tracking</h2>
        
        <div>
          <label className="block text-gray-700 text-sm mb-2">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a subject</option>
            {subjects.map((subject) => (
              <option key={subject.name} value={subject.name}>
                {subject.name} ({subject.type === 'core' ? 'Core' : 'Elective'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSubject && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg shadow-md p-3 text-center border border-green-200">
              <div className="text-green-700 text-xs mb-1">Completed</div>
              <div className="text-xl text-green-700">{stats.completed}</div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-md p-3 text-center border border-blue-200">
              <div className="text-blue-700 text-xs mb-1">In Progress</div>
              <div className="text-xl text-blue-700">{stats.inProgress}</div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-3 text-center border border-gray-200">
              <div className="text-gray-700 text-xs mb-1">Planned</div>
              <div className="text-xl text-gray-700">{stats.planned}</div>
            </div>
          </div>

          {/* Add Topic Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Topic
            </button>
          )}

          {/* Add Topic Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-900 mb-3">Add New Topic</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Enter topic name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTopicName('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTopic}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Topic
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Topics List */}
          {topics.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-gray-900 mb-3">Topics</h3>
              <div className="space-y-3">
                {topics.map((topic) => (
                  <div key={topic.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-900">{topic.name}</span>
                      </div>
                      <button
                        onClick={() => deleteTopic(topic.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTopicStatus(topic.id, 'planned')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs transition-colors ${
                          topic.status === 'planned'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Planned
                      </button>
                      <button
                        onClick={() => updateTopicStatus(topic.id, 'in-progress')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${
                          topic.status === 'in-progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        In Progress
                      </button>
                      <button
                        onClick={() => updateTopicStatus(topic.id, 'completed')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${
                          topic.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-700 mb-2">No Topics Yet</h3>
              <p className="text-gray-600 text-sm">
                Add topics to track your teaching progress.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
