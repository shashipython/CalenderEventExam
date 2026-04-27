import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, User } from 'lucide-react';

interface Registration {
  id: string;
  studentName: string;
  dateOfBirth: string;
  age: string;
  grade: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function RegistrationProcessing() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = () => {
    const data = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
    setRegistrations(data);
  };

  const handleApprove = (regId: string) => {
    const updatedRegs = registrations.map(r =>
      r.id === regId ? { ...r, status: 'approved' as const } : r
    );
    setRegistrations(updatedRegs);
    localStorage.setItem('studentRegistrations', JSON.stringify(updatedRegs));

    // Add to students list
    const reg = registrations.find(r => r.id === regId);
    if (reg) {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      students.push({
        id: reg.id,
        name: reg.studentName,
        grade: reg.grade,
        section: 'A', // Default section
        parentEmail: reg.email,
        parentPhone: reg.phone
      });
      localStorage.setItem('students', JSON.stringify(students));
    }

    setSelectedReg(null);
  };

  const handleReject = (regId: string) => {
    const updatedRegs = registrations.map(r =>
      r.id === regId ? { ...r, status: 'rejected' as const } : r
    );
    setRegistrations(updatedRegs);
    localStorage.setItem('studentRegistrations', JSON.stringify(updatedRegs));
    setSelectedReg(null);
  };

  const filteredRegs = registrations.filter(r => 
    filter === 'all' ? true : r.status === filter
  );

  const stats = {
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Student Registrations</h2>
        <p className="text-gray-600 text-sm">Process and approve student registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-yellow-50 rounded-lg shadow-md p-3 text-center border border-yellow-200">
          <div className="text-yellow-700 text-xs mb-1">Pending</div>
          <div className="text-xl text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-3 text-center border border-green-200">
          <div className="text-green-700 text-xs mb-1">Approved</div>
          <div className="text-xl text-green-700">{stats.approved}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-3 text-center border border-red-200">
          <div className="text-red-700 text-xs mb-1">Rejected</div>
          <div className="text-xl text-red-700">{stats.rejected}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'pending'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'approved'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === 'rejected'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Registrations List */}
      {filteredRegs.length > 0 ? (
        <div className="space-y-3">
          {filteredRegs.map((reg) => (
            <div key={reg.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{reg.studentName}</h3>
                    <p className="text-gray-600 text-sm">Grade {reg.grade} {reg.age ? `· Age ${reg.age}` : ''}</p>
                    <p className="text-gray-500 text-xs mt-1">{reg.parentName}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  reg.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : reg.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReg(reg)}
                  className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {reg.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(reg.id)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(reg.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-700 mb-2">No Registrations</h3>
          <p className="text-gray-600 text-sm">
            {filter === 'pending' 
              ? 'No pending registrations to review.'
              : 'No registrations found for this filter.'}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-gray-900">Registration Details</h3>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="text-gray-600 text-sm mb-1">Student Name</div>
                <div className="text-gray-900">{selectedReg.studentName}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Date of Birth</div>
                <div className="text-gray-900">
                  {new Date(selectedReg.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Age</div>
                <div className="text-gray-900">{selectedReg.age ? `${selectedReg.age} years` : 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Grade</div>
                <div className="text-gray-900">Grade {selectedReg.grade}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Parent Name</div>
                <div className="text-gray-900">{selectedReg.parentName}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Email</div>
                <div className="text-gray-900">{selectedReg.email}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Phone</div>
                <div className="text-gray-900">{selectedReg.phone}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm mb-1">Address</div>
                <div className="text-gray-900">{selectedReg.address}</div>
              </div>

              {selectedReg.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleApprove(selectedReg.id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedReg.id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
