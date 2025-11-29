import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';

const CreateCaseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'civil',
    description: '',
    filing_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/cases', formData);
      alert('Case created successfully!');
      setFormData({
        title: '',
        type: 'civil',
        description: '',
        filing_date: new Date().toISOString().split('T')[0]
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Matter</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Case Title *"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="civil">Civil</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            <option value="corporate">Corporate</option>
            <option value="immigration">Immigration</option>
            <option value="personal_injury">Personal Injury</option>
            <option value="real_estate">Real Estate</option>
            <option value="other">Other</option>
          </select>
          <textarea
            placeholder="Case Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg h-20 resize-none"
          />
          <input
            type="date"
            value={formData.filing_date}
            onChange={(e) => setFormData({...formData, filing_date: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Case'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;