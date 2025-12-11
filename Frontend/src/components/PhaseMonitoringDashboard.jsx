import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageCircle, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const PhaseMonitoringDashboard = () => {
  const [phaseStatus, setPhaseStatus] = useState(null);
  const [adoptionMetrics, setAdoptionMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhaseStatus();
    fetchAdoptionMetrics();
  }, []);

  const fetchPhaseStatus = async () => {
    try {
      const response = await api.get('/phase/status');
      setPhaseStatus(response.data.data);
    } catch (error) {
      console.error('Error fetching phase status:', error);
    }
  };

  const fetchAdoptionMetrics = async () => {
    try {
      const response = await api.get('/phase/adoption?days=7');
      setAdoptionMetrics(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching adoption metrics:', error);
      setLoading(false);
    }
  };

  const handlePhaseTransition = async (targetPhase) => {
    if (!window.confirm(`Are you sure you want to transition to ${targetPhase}?`)) return;
    
    try {
      const reason = prompt('Enter reason for phase transition:');
      if (!reason) return;

      await api.post('/phase/transition', {
        target_phase: targetPhase,
        reason
      });
      
      alert('Phase transition successful!');
      fetchPhaseStatus();
    } catch (error) {
      alert('Phase transition failed: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase Status Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Enterprise Case Management</h2>
            <p className="text-blue-100">
              Current Phase: <span className="font-semibold">{phaseStatus?.current_phase}</span>
            </p>
            <p className="text-blue-100 text-sm mt-1">{phaseStatus?.phase_description}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{phaseStatus?.metrics?.message_association_rate || 0}%</div>
              <div className="text-sm text-blue-100">Message Association</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {phaseStatus?.metrics?.message_association_rate || 0}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Message Association</h3>
          <p className="text-sm text-gray-600">Messages linked to cases</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {phaseStatus?.metrics?.document_association_rate || 0}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Document Association</h3>
          <p className="text-sm text-gray-600">Documents linked to cases</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {phaseStatus?.metrics?.weekly_activity || 0}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Weekly Activity</h3>
          <p className="text-sm text-gray-600">Audit events this week</p>
        </div>
      </div>

      {/* Recommendations */}
      {phaseStatus?.recommendations && phaseStatus.recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {phaseStatus.recommendations.map((rec, index) => (
              <li key={index} className="text-amber-800 text-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phase Transition Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Phase Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            phaseStatus?.current_phase === 'PHASE_1' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {phaseStatus?.current_phase === 'PHASE_1' ? (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
              <span className="font-medium">Phase 1</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Soft warnings for case association</p>
            {phaseStatus?.current_phase !== 'PHASE_1' && (
              <button
                onClick={() => handlePhaseTransition('PHASE_1')}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Activate
              </button>
            )}
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            phaseStatus?.current_phase === 'PHASE_2' 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {phaseStatus?.current_phase === 'PHASE_2' ? (
                <CheckCircle className="w-5 h-5 text-orange-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
              <span className="font-medium">Phase 2</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Gated creation requires cases</p>
            {phaseStatus?.current_phase !== 'PHASE_2' && (
              <button
                onClick={() => handlePhaseTransition('PHASE_2')}
                className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
              >
                Transition
              </button>
            )}
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            phaseStatus?.current_phase === 'PHASE_3' 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {phaseStatus?.current_phase === 'PHASE_3' ? (
                <CheckCircle className="w-5 h-5 text-red-600" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              )}
              <span className="font-medium">Phase 3</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Case-only communication mode</p>
            {phaseStatus?.current_phase !== 'PHASE_3' && (
              <button
                onClick={() => handlePhaseTransition('PHASE_3')}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Enforce
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Adoption Trends */}
      {adoptionMetrics && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">7-Day Adoption Trends</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Total Messages</h4>
              <div className="text-2xl font-bold text-gray-900">
                {adoptionMetrics.summary?.total_period_messages || 0}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Case-Associated</h4>
              <div className="text-2xl font-bold text-green-600">
                {adoptionMetrics.summary?.case_associated_messages || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseMonitoringDashboard;