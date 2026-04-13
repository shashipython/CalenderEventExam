import { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, Plus } from 'lucide-react';

interface Event {
  id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export function EventCreation() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    status: 'draft' as const
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
      );
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEditingEvent(null);
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }

    // Reset form
    setFormData({
      eventName: '',
      startDate: '',
      endDate: '',
      status: 'draft'
    });
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      eventName: event.eventName,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status
    });
    setShowForm(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      eventName: '',
      startDate: '',
      endDate: '',
      status: 'draft'
    });
    setErrors({});
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      published: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Published' },
      ongoing: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ongoing' },
      completed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: events.length,
    draft: events.filter(e => e.status === 'draft').length,
    published: events.filter(e => e.status === 'published').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="text-gray-600 text-sm mb-1">Total Events</div>
          <div className="text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <div className="text-gray-600 text-sm mb-1">Draft</div>
          <div className="text-gray-900">{stats.draft}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-gray-600 text-sm mb-1">Published</div>
          <div className="text-gray-900">{stats.published}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-gray-600 text-sm mb-1">Ongoing</div>
          <div className="text-gray-900">{stats.ongoing}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="text-gray-600 text-sm mb-1">Completed</div>
          <div className="text-gray-900">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="text-gray-600 text-sm mb-1">Cancelled</div>
          <div className="text-gray-900">{stats.cancelled}</div>
        </div>
      </div>

      {/* Header with Create Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-indigo-600 mb-1">Event Management</h2>
            <p className="text-gray-600">Create and manage events</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          )}
        </div>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-gray-900 mb-6">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.eventName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event name"
              />
              {errors.eventName && (
                <p className="text-red-600 text-sm mt-1">{errors.eventName}</p>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start Date *
                  </div>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    End Date *
                  </div>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Event Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Event Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Start Date</th>
                <th className="px-6 py-3 text-left text-gray-700">End Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No events created yet. Click "Create Event" to get started.
                  </td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{event.eventName}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(event.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-600 hover:text-indigo-700 p-2"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Delete Event"
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
