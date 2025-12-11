import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const PRACTICE_AREAS = {
  FAMILY: 'Family Law',
  CIVIL: 'Civil Law',
  CRIMINAL: 'Criminal Law',
  CORPORATE: 'Corporate Law',
  TAX: 'Tax Law',
  IP: 'Intellectual Property',
  IMMIGRATION: 'Immigration Law',
  REAL_ESTATE: 'Real Estate Law',
  PERSONAL_INJURY: 'Personal Injury'
};

const EnhancedCreateCaseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    practice_area: '',
    description: '',
    filing_date: new Date().toISOString().split('T')[0],
    client_id: '',
    estimated_value: '',
    sla_days: 30
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/enhanced-cases/create', formData);
      
      if (response.data.success) {
        alert(`Case created successfully! Case ID: ${response.data.data.secure_case_id}`);
        setFormData({
          title: '',
          practice_area: '',
          description: '',
          filing_date: new Date().toISOString().split('T')[0],
          client_id: '',
          estimated_value: '',
          sla_days: 30
        });
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create case');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Case</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case Title *
            </label>
            <input
              type="text"
              placeholder="Enter case title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Area *
            </label>
            <select
              value={formData.practice_area}
              onChange={(e) => setFormData({...formData, practice_area: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select practice area</option>
              {Object.entries(PRACTICE_AREAS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case Description
            </label>
            <textarea
              placeholder="Enter case description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                value={formData.filing_date}
                onChange={(e) => setFormData({...formData, filing_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SLA Days
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.sla_days}
                onChange={(e) => setFormData({...formData, sla_days: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Value ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.estimated_value}
              onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A secure Case ID will be automatically generated in the format: 
              LC-{formData.practice_area || 'AREA'}-2025-XXXXXXXXXXXX
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EnhancedCreateCaseModal;