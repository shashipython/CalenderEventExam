import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

export function StudentRegistration() {
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    age: '',
    grade: '',
    parentName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const calculateAge = (dob: string): string => {
    if (!dob) return '';
    const birthYear = parseInt(dob.split('-')[0], 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'dateOfBirth') {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const registrations = JSON.parse(localStorage.getItem('studentRegistrations') || '[]');
    const newRegistration = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    registrations.push(newRegistration);
    localStorage.setItem('studentRegistrations', JSON.stringify(registrations));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        studentName: '',
        dateOfBirth: '',
        age: '',
        grade: '',
        parentName: '',
        email: '',
        phone: '',
        address: ''
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-green-600 mb-2">Registration Submitted!</h3>
        <p className="text-gray-600">Your registration has been submitted successfully. The school admin will process it soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-gray-900 mb-1">Student Registration</h2>
        <p className="text-gray-600 text-sm">Register your child for the academic year</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <h3 className="text-gray-900">Student Information</h3>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Name *
              </div>
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter student name"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 text-sm mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth *
                </div>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Age *</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                readOnly
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Auto-calculated"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1">Grade *</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <h3 className="text-gray-900">Parent Information</h3>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Parent Name *</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter parent name"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </div>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="parent@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </div>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address *
              </div>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter full address"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}
