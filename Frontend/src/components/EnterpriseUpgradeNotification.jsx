import React, { useState, useEffect } from 'react';
import { Shield, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const EnterpriseUpgradeNotification = () => {
  const [phaseStatus, setPhaseStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    checkPhaseStatus();
    // Check if user has dismissed the notification
    const dismissed = localStorage.getItem('enterprise-notification-dismissed');
    setIsDismissed(dismissed === 'true');
  }, []);

  const checkPhaseStatus = async () => {
    try {
      const response = await api.get('/phase-monitoring/status');
      setPhaseStatus(response.data);
      
      // Show notification if Phase 1 is active and not dismissed
      if (response.data?.currentPhase === 1) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error checking phase status:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('enterprise-notification-dismissed', 'true');
  };

  if (!isVisible || isDismissed || !phaseStatus) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-4 border border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Enterprise Upgrade Active</h3>
              <p className="text-xs text-blue-100 mb-2">
                LegalCity is now enhanced with enterprise-grade security features.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-300" />
                  <span className="text-blue-100">Secure Case IDs</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-300" />
                  <span className="text-blue-100">Enhanced Security</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <AlertCircle className="w-3 h-3 text-amber-300" />
                  <span className="text-blue-100">Phase {phaseStatus.currentPhase} Active</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-200 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseUpgradeNotification;