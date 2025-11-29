import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';

const ReportBlogModal = ({ isOpen, onClose, blogId, blogTitle }) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    reporter_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const reasons = [
    { value: 'vulgar', label: 'Vulgar/Inappropriate Content', icon: '🚫' },
    { value: 'spam', label: 'Spam or Misleading', icon: '📧' },
    { value: 'copyright', label: 'Copyright Violation', icon: '©️' },
    { value: 'harassment', label: 'Harassment or Hate Speech', icon: '⚠️' },
    { value: 'misinformation', label: 'False Legal Information', icon: '❌' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason) return;
    if (!isLoggedIn && !formData.reporter_email) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      // Only add auth header if we have a valid token
      if (token && token !== 'null' && token !== 'undefined') {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/blogs/${blogId}/report`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({ reason: '', description: '', reporter_email: '' });
        }, 2000);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h3>
          <p className="text-gray-600">Thank you for reporting this content. Our admin team will review it shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Report Blog</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Reporting: <span className="font-medium">"{blogTitle}"</span>
            </p>
          </div>

          {!isLoggedIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={formData.reporter_email}
                onChange={(e) => setFormData({...formData, reporter_email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for Report *
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <label key={reason.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={formData.reason === reason.value}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="mr-3 text-red-600 focus:ring-red-500"
                  />
                  <span className="mr-2">{reason.icon}</span>
                  <span className="text-sm font-medium">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Provide more details about why you're reporting this content..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.reason || (!isLoggedIn && !formData.reporter_email)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportBlogModal;