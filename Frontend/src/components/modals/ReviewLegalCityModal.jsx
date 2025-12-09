import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ReviewLegalCityModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    review_text: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [lawyerData, setLawyerData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchLawyerData();
    }
  }, [isOpen]);

  const fetchLawyerData = async () => {
    try {
      setDataLoading(true);
      // Try multiple endpoints to get lawyer data
      let response;
      try {
        response = await api.get('/lawyer-dashboard/profile');
      } catch (err) {
        // Fallback to auth/me endpoint
        response = await api.get('/auth/me');
      }
      setLawyerData(response.data);
    } catch (error) {
      console.error('Error fetching lawyer data:', error);
      // Get from localStorage as fallback
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setLawyerData({ 
        name: user.name || 'Professional User', 
        speciality: user.speciality || user.law_firm || 'Legal Professional' 
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        ...formData,
        client_name: lawyerData?.name || 'Professional User',
        client_title: lawyerData?.speciality || lawyerData?.law_firm || 'Legal Professional'
      };
      
      console.log('Submitting review:', reviewData);
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      await api.post('/platform-reviews', reviewData);
      onSuccess?.();
      onClose();
      setFormData({ review_text: '', rating: 5 });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Review LegalCity</h2>
              <p className="text-sm text-gray-500">Share your experience with our platform</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading your profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reviewer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {lawyerData?.name?.charAt(0)?.toUpperCase() || 'L'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reviewing as:</h3>
                    <p className="text-blue-700 font-medium">{lawyerData?.name || 'Professional User'}</p>
                    <p className="text-sm text-blue-600">{lawyerData?.speciality || 'Legal Professional'}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How would you rate LegalCity? *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-3xl transition-all duration-200 hover:scale-110 ${
                        star <= formData.rating 
                          ? 'text-amber-400 drop-shadow-sm' 
                          : 'text-gray-300 hover:text-amber-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {formData.rating === 5 ? 'Excellent' : 
                     formData.rating === 4 ? 'Very Good' :
                     formData.rating === 3 ? 'Good' :
                     formData.rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Share your experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Tell us about your experience with LegalCity. How has our platform helped you in your legal practice?"
                />
                <p className="text-xs text-gray-500 mt-2">Your review will be reviewed before being published on our website.</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.review_text.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewLegalCityModal;