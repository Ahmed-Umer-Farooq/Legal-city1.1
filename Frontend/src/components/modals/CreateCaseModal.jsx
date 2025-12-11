import React, { useState, useEffect } from 'react';
import { X, Shield, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const CreateCaseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'civil',
    description: '',
    filing_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [previewCaseId, setPreviewCaseId] = useState('');
  const [phaseStatus, setPhaseStatus] = useState(null);

  // Generate preview Case ID when practice area changes
  useEffect(() => {
    if (formData.type) {
      const year = new Date().getFullYear();
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      setPreviewCaseId(`LC-${formData.type.toUpperCase()}-${year}-${randomString}`);
    }
  }, [formData.type]);

  // Check phase status on mount
  useEffect(() => {
    if (isOpen) {
      checkPhaseStatus();
    }
  }, [isOpen]);

  const checkPhaseStatus = async () => {
    try {
      const response = await api.get('/phase-monitoring/status');
      setPhaseStatus(response.data);
    } catch (error) {
      console.error('Error checking phase status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Use enhanced case creation endpoint
      const response = await api.post('/enhanced-cases', formData);
      
      if (response.data.success) {
        alert(`Case created successfully!\nSecure Case ID: ${response.data.case.case_id}`);
        setFormData({
          title: '',
          type: 'civil',
          description: '',
          filing_date: new Date().toISOString().split('T')[0]
        });
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      // Fallback to legacy endpoint if enhanced not available
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
      } catch (fallbackError) {
        alert(fallbackError.response?.data?.error || 'Failed to create case');
      }
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
            <option value="civil">Civil Law</option>
            <option value="criminal">Criminal Law</option>
            <option value="family">Family Law</option>
            <option value="corporate">Corporate Law</option>
            <option value="immigration">Immigration Law</option>
            <option value="personal_injury">Personal Injury</option>
            <option value="real_estate">Real Estate Law</option>
            <option value="intellectual_property">Intellectual Property</option>
            <option value="employment">Employment Law</option>
            <option value="tax">Tax Law</option>
            <option value="other">Other</option>
          </select>
          
          {/* Secure Case ID Preview */}
          {previewCaseId && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Secure Case ID Preview</span>
              </div>
              <code className="text-sm font-mono text-blue-800">{previewCaseId}</code>
              <p className="text-xs text-blue-600 mt-1">Final ID will be generated upon case creation</p>
            </div>
          )}
          
          {/* Phase Status Warning */}
          {phaseStatus && phaseStatus.currentPhase === 1 && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Enterprise Upgrade Active</span>
              </div>
              <p className="text-xs text-amber-700">
                System is transitioning to secure case management. All new cases will receive enterprise-grade Case IDs.
              </p>
            </div>
          )}
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
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
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