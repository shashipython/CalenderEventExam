import { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, Plus, Building } from 'lucide-react';

interface Venue {
  id: string;
  venueName: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  location: string;
  createdAt: string;
}

export function VenueCreation() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    venueName: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    location: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = () => {
    const storedVenues = JSON.parse(localStorage.getItem('venues') || '[]');
    setVenues(storedVenues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.venueName.trim()) {
      newErrors.venueName = 'Venue name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingVenue) {
      // Update existing venue
      const updatedVenues = venues.map(venue =>
        venue.id === editingVenue.id
          ? { ...venue, ...formData }
          : venue
      );
      setVenues(updatedVenues);
      localStorage.setItem('venues', JSON.stringify(updatedVenues));
      setEditingVenue(null);
    } else {
      // Create new venue
      const newVenue: Venue = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      const updatedVenues = [...venues, newVenue];
      setVenues(updatedVenues);
      localStorage.setItem('venues', JSON.stringify(updatedVenues));
    }

    // Reset form
    setFormData({
      venueName: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      location: ''
    });
    setShowForm(false);
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      venueName: venue.venueName,
      address: venue.address,
      pincode: venue.pincode,
      city: venue.city,
      state: venue.state,
      location: venue.location
    });
    setShowForm(true);
  };

  const handleDelete = (venueId: string) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      const updatedVenues = venues.filter(v => v.id !== venueId);
      setVenues(updatedVenues);
      localStorage.setItem('venues', JSON.stringify(updatedVenues));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVenue(null);
    setFormData({
      venueName: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      location: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Total Venues</div>
              <div className="text-gray-900">{venues.length}</div>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Available</div>
              <div className="text-gray-900">{venues.length}</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm mb-1">Locations</div>
              <div className="text-gray-900">
                {new Set(venues.map(v => v.location)).size}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Create Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-indigo-600 mb-1">Venue Management</h2>
            <p className="text-gray-600">Create and manage event venues</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Venue
            </button>
          )}
        </div>
      </div>

      {/* Venue Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-gray-900 mb-6">
            {editingVenue ? 'Edit Venue' : 'Add New Venue'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Venue Name */}
            <div>
              <label htmlFor="venueName" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Venue Name *
                </div>
              </label>
              <input
                type="text"
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.venueName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter venue name"
              />
              {errors.venueName && (
                <p className="text-red-600 text-sm mt-1">{errors.venueName}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter pincode"
              />
              {errors.pincode && (
                <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-600 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location *
                </div>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., City, State or Region"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingVenue ? 'Update Venue' : 'Create Venue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Venues List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Venue Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Address</th>
                <th className="px-6 py-3 text-left text-gray-700">Location</th>
                <th className="px-6 py-3 text-left text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {venues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No venues created yet. Click "Add Venue" to get started.
                  </td>
                </tr>
              ) : (
                venues.map(venue => (
                  <tr key={venue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{venue.venueName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="max-w-xs truncate" title={venue.address}>
                        {venue.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-700">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {venue.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(venue.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(venue)}
                          className="text-indigo-600 hover:text-indigo-700 p-2"
                          title="Edit Venue"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(venue.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Delete Venue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}