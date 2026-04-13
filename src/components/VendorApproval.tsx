import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Mail, Phone, Building2, Tag, Package, MapPin, Hash, CreditCard } from 'lucide-react';

interface Vendor {
  id: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
  category: string;
  description: string;
  experience: string;
  servicesOffered: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  taskAssigned: boolean;
  taskDetails?: string;
  taskStatus?: 'not-started' | 'in-progress' | 'completed';
}

export function VendorApproval() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [taskDetails, setTaskDetails] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [vendorToAssignTask, setVendorToAssignTask] = useState<Vendor | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    setVendors(storedVendors);
  };

  const handleApprove = (vendorId: string) => {
    const updatedVendors = vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'approved' as const } : v
    );
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setSelectedVendor(null);
  };

  const handleReject = (vendorId: string) => {
    const updatedVendors = vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'rejected' as const } : v
    );
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setSelectedVendor(null);
  };

  const handleAssignTask = (vendor: Vendor) => {
    setVendorToAssignTask(vendor);
    setTaskDetails(vendor.taskDetails || '');
    setShowTaskModal(true);
  };

  const submitTaskAssignment = () => {
    if (!vendorToAssignTask) return;

    const updatedVendors = vendors.map(v =>
      v.id === vendorToAssignTask.id
        ? { ...v, taskAssigned: true, taskDetails, taskStatus: 'not-started' as const }
        : v
    );
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setShowTaskModal(false);
    setTaskDetails('');
    setVendorToAssignTask(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getTaskStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
            In Progress
          </span>
        );
      case 'not-started':
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            Not Started
          </span>
        );
      default:
        return null;
    }
  };

  const filteredVendors = vendors.filter(v => 
    filterStatus === 'all' ? true : v.status === filterStatus
  );

  const stats = {
    total: vendors.length,
    pending: vendors.filter(v => v.status === 'pending').length,
    approved: vendors.filter(v => v.status === 'approved').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
    tasksAssigned: vendors.filter(v => v.taskAssigned).length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm mb-1">Total Vendors</div>
          <div className="text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
          <div className="text-yellow-700 text-sm mb-1">Pending</div>
          <div className="text-yellow-900">{stats.pending}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border border-green-200">
          <div className="text-green-700 text-sm mb-1">Approved</div>
          <div className="text-green-900">{stats.approved}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6 border border-red-200">
          <div className="text-red-700 text-sm mb-1">Rejected</div>
          <div className="text-red-900">{stats.rejected}</div>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow p-6 border border-indigo-200">
          <div className="text-indigo-700 text-sm mb-1">Tasks Assigned</div>
          <div className="text-indigo-900">{stats.tasksAssigned}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Vendor Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Contact Person</th>
                <th className="px-6 py-3 text-left text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Task</th>
                <th className="px-6 py-3 text-left text-gray-700">Submitted</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{vendor.vendorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{vendor.contactPerson}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">
                        <Tag className="w-3 h-3" />
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(vendor.status)}</td>
                    <td className="px-6 py-4">
                      {vendor.taskAssigned ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Assigned
                          </div>
                          {getTaskStatusBadge(vendor.taskStatus)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(vendor.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-indigo-600 hover:text-indigo-700 p-2"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {vendor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              className="text-green-600 hover:text-green-700 p-2"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(vendor.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {vendor.status === 'approved' && (
                          <button
                            onClick={() => handleAssignTask(vendor)}
                            className="text-indigo-600 hover:text-indigo-700 p-2"
                            title="Assign Task"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-900 mb-2">{selectedVendor.vendorName}</h3>
                  {getStatusBadge(selectedVendor.status)}
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                    <Building2 className="w-4 h-4" />
                    Vendor Name
                  </div>
                  <p className="text-gray-900">{selectedVendor.vendorName}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="text-gray-900">{selectedVendor.email}</p>
                </div>

                <div>
                  <div className="text-gray-600 mb-1 text-sm">Contact Person</div>
                  <p className="text-gray-900">{selectedVendor.contactPerson}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <p className="text-gray-900">{selectedVendor.phone}</p>
                </div>

                {selectedVendor.pincode && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      Pincode
                    </div>
                    <p className="text-gray-900">{selectedVendor.pincode}</p>
                  </div>
                )}

                {selectedVendor.city && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      City
                    </div>
                    <p className="text-gray-900">{selectedVendor.city}</p>
                  </div>
                )}

                {selectedVendor.state && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      State
                    </div>
                    <p className="text-gray-900">{selectedVendor.state}</p>
                  </div>
                )}

                {selectedVendor.gstNumber && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                      <CreditCard className="w-4 h-4" />
                      GST Number
                    </div>
                    <p className="text-gray-900">{selectedVendor.gstNumber}</p>
                  </div>
                )}

                {selectedVendor.panNumber && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                      <Hash className="w-4 h-4" />
                      PAN Number
                    </div>
                    <p className="text-gray-900">{selectedVendor.panNumber}</p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1 text-sm">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                  <p className="text-gray-900">{selectedVendor.category}</p>
                </div>

                {selectedVendor.experience && (
                  <div>
                    <div className="text-gray-600 mb-1 text-sm">Experience</div>
                    <p className="text-gray-900">{selectedVendor.experience}</p>
                  </div>
                )}
              </div>

              {selectedVendor.servicesOffered && (
                <div>
                  <div className="text-gray-600 mb-1 text-sm">Services Offered</div>
                  <p className="text-gray-900">{selectedVendor.servicesOffered}</p>
                </div>
              )}

              <div>
                <div className="text-gray-600 mb-1 text-sm">Business Description</div>
                <p className="text-gray-900">{selectedVendor.description}</p>
              </div>

              {selectedVendor.taskAssigned && selectedVendor.taskDetails && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 text-indigo-700 mb-2">
                    <Package className="w-4 h-4" />
                    <span>Assigned Task</span>
                  </div>
                  <p className="text-gray-900">{selectedVendor.taskDetails}</p>
                  <div className="mt-2">
                    {getTaskStatusBadge(selectedVendor.taskStatus)}
                  </div>
                </div>
              )}

              {selectedVendor.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedVendor.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </button>
                  <button
                    onClick={() => handleReject(selectedVendor.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Vendor
                  </button>
                </div>
              )}

              {selectedVendor.status === 'approved' && (
                <div className="pt-4">
                  <button
                    onClick={() => handleAssignTask(selectedVendor)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    {selectedVendor.taskAssigned ? 'Update Task Assignment' : 'Assign Task'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Assignment Modal */}
      {showTaskModal && vendorToAssignTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">Assign Task to {vendorToAssignTask.vendorName}</h3>
            </div>

            <div className="p-6">
              <label htmlFor="taskDetails" className="block text-gray-700 mb-2">
                Task Details
              </label>
              <textarea
                id="taskDetails"
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the task to be assigned to this vendor..."
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setTaskDetails('');
                    setVendorToAssignTask(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTaskAssignment}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}