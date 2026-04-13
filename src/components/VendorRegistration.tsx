import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, User, Tag, CheckCircle, Clock, XCircle, Package, MapPin, Hash, CreditCard } from 'lucide-react';

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

const TASK_CATEGORIES = [
  'Food',
  'Drinks',
  'Snacks',
  'Medical',
  'Decoration',
  'Audio/Visual',
  'Photography',
  'Transportation',
  'Security',
  'Cleaning',
  'Other'
];

export function VendorRegistration() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    gstNumber: '',
    panNumber: '',
    category: '',
    description: '',
    experience: '',
    servicesOffered: ''
  });
  const [taskStatus, setTaskStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');

  useEffect(() => {
    // Load current vendor data
    const currentVendorId = localStorage.getItem('currentVendorId');
    if (currentVendorId) {
      const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      const currentVendor = vendors.find((v: Vendor) => v.id === currentVendorId);
      if (currentVendor) {
        setVendor(currentVendor);
        setFormData({
          vendorName: currentVendor.vendorName,
          contactPerson: currentVendor.contactPerson,
          email: currentVendor.email,
          phone: currentVendor.phone,
          pincode: currentVendor.pincode || '',
          city: currentVendor.city || '',
          state: currentVendor.state || '',
          gstNumber: currentVendor.gstNumber || '',
          panNumber: currentVendor.panNumber || '',
          category: currentVendor.category,
          description: currentVendor.description,
          experience: currentVendor.experience || '',
          servicesOffered: currentVendor.servicesOffered || ''
        });
        setTaskStatus(currentVendor.taskStatus || 'not-started');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendor) return;

    // Update vendor data in localStorage
    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const updatedVendors = vendors.map((v: Vendor) => 
      v.id === vendor.id ? { ...v, ...formData } : v
    );
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    
    setVendor({ ...vendor, ...formData });
    setIsEditing(false);
  };

  const handleTaskStatusUpdate = (newStatus: 'not-started' | 'in-progress' | 'completed') => {
    if (!vendor) return;

    setTaskStatus(newStatus);

    // Update task status in localStorage
    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    const updatedVendors = vendors.map((v: Vendor) => 
      v.id === vendor.id ? { ...v, taskStatus: newStatus } : v
    );
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));
    setVendor({ ...vendor, taskStatus: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
            Approved
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5" />
            Pending Approval
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
            <XCircle className="w-5 h-5" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            In Progress
          </span>
        );
      case 'not-started':
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            Not Started
          </span>
        );
      default:
        return null;
    }
  };

  if (!vendor) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-gray-700 mb-2">No Registration Found</h2>
          <p className="text-gray-600">
            Please complete the vendor signup first to view your registration details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">Registration Status</h2>
            <p className="text-gray-600">
              Submitted on {new Date(vendor.submittedAt).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge(vendor.status)}
        </div>
      </div>

      {/* Task Assignment Card - Only show if approved and task assigned */}
      {vendor.status === 'approved' && vendor.taskAssigned && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 border border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-indigo-900 mb-2">Task Assigned</h3>
              <p className="text-gray-700 mb-4">
                {vendor.taskDetails || 'You have been assigned a task for the upcoming event.'}
              </p>
              
              {/* Task Status Update */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">Current Status:</span>
                  {getTaskStatusBadge(taskStatus)}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTaskStatusUpdate('not-started')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      taskStatus === 'not-started'
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => handleTaskStatusUpdate('in-progress')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      taskStatus === 'in-progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleTaskStatusUpdate('completed')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      taskStatus === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Details Card */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-indigo-600">Vendor Details</h2>
          {vendor.status === 'approved' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-indigo-600 hover:text-indigo-700 px-4 py-2 border border-indigo-600 rounded-lg transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Details'}
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Vendor Name */}
            <div>
              <label htmlFor="vendorName" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Vendor/Company Name
                </div>
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Person
                </div>
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Pincode, City, State */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pincode" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pincode
                  </div>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </div>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    State
                  </div>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* GST Number and PAN Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gstNumber" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    GST Number
                  </div>
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="panNumber" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    PAN Number
                  </div>
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Service Category
                </div>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                {TASK_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Services Offered */}
            <div>
              <label htmlFor="servicesOffered" className="block text-gray-700 mb-2">
                Services Offered
              </label>
              <textarea
                id="servicesOffered"
                name="servicesOffered"
                value={formData.servicesOffered}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update Details
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">Vendor Name</span>
                </div>
                <p className="text-gray-900">{vendor.vendorName}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Contact Person</span>
                </div>
                <p className="text-gray-900">{vendor.contactPerson}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="text-gray-900">{vendor.email}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Phone</span>
                </div>
                <p className="text-gray-900">{vendor.phone}</p>
              </div>

              {vendor.pincode && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Pincode</span>
                  </div>
                  <p className="text-gray-900">{vendor.pincode}</p>
                </div>
              )}

              {vendor.city && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">City</span>
                  </div>
                  <p className="text-gray-900">{vendor.city}</p>
                </div>
              )}

              {vendor.state && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">State</span>
                  </div>
                  <p className="text-gray-900">{vendor.state}</p>
                </div>
              )}

              {vendor.gstNumber && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">GST Number</span>
                  </div>
                  <p className="text-gray-900">{vendor.gstNumber}</p>
                </div>
              )}

              {vendor.panNumber && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">PAN Number</span>
                  </div>
                  <p className="text-gray-900">{vendor.panNumber}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Category</span>
                </div>
                <p className="text-gray-900">{vendor.category}</p>
              </div>

              {vendor.experience && (
                <div>
                  <div className="text-gray-600 mb-1 text-sm">Experience</div>
                  <p className="text-gray-900">{vendor.experience}</p>
                </div>
              )}
            </div>

            {vendor.servicesOffered && (
              <div className="pt-4">
                <div className="text-gray-600 mb-1 text-sm">Services Offered</div>
                <p className="text-gray-900">{vendor.servicesOffered}</p>
              </div>
            )}

            <div className="pt-4">
              <div className="text-gray-600 mb-1 text-sm">Business Description</div>
              <p className="text-gray-900">{vendor.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}