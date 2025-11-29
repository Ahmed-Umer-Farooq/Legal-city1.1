import React, { useState } from 'react';
import api from '../../utils/api';

const RoleUpdater = () => {
  const [loading, setLoading] = useState(false);

  const updateRole = async () => {
    setLoading(true);
    try {
      // Try multiple approaches to update the role
      const approaches = [
        () => api.put('/auth/me', { role: 'lawyer' }),
        () => api.patch('/auth/me', { role: 'lawyer' }),
        () => api.post('/auth/update-role', { role: 'lawyer' }),
        () => api.put('/users/me', { role: 'lawyer' })
      ];

      for (const approach of approaches) {
        try {
          await approach();
          alert('✅ Role updated successfully! Please refresh and try creating a blog.');
          return;
        } catch (error) {
          console.log('Approach failed:', error.response?.status);
        }
      }
      
      alert('❌ All update approaches failed. Contact admin to update your role to "lawyer" in the database.');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to update role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Role Issue Detected</h3>
      <p className="text-yellow-700 mb-4">
        Your account role is "user" but needs to be "lawyer" to create blogs.
      </p>
      <button
        onClick={updateRole}
        disabled={loading}
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Fix Role Issue'}
      </button>
    </div>
  );
};

export default RoleUpdater;