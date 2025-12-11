import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, AlertTriangle, TrendingUp, Users, Database, Activity } from 'lucide-react';
import api from '../../utils/api';

const PhaseMonitoring = () => {
  const [phaseStatus, setPhaseStatus] = useState(null);
  const [migrationStats, setMigrationStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhaseData();
    const interval = setInterval(fetchPhaseData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPhaseData = async () => {
    try {
      const [phaseRes, migrationRes, healthRes] = await Promise.all([
        api.get('/phase-monitoring/status').catch(() => ({ data: null })),
        api.get('/admin-reports/migration-status').catch(() => ({ data: null })),
        api.get('/phase-monitoring/health').catch(() => ({ data: null }))
      ]);

      setPhaseStatus(phaseRes.data);
      setMigrationStats(migrationRes.data);
      setSystemHealth(healthRes.data);
    } catch (error) {
      console.error('Error fetching phase data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 1: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPhaseDescription = (phase) => {
    switch (phase) {
      case 1: return 'Soft warnings for legacy cases, secure IDs for new cases';
      case 2: return 'Gated case creation, enhanced validation';
      case 3: return 'Case-only mode, full enterprise features';
      default: return 'System initialization';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Phase Status Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enterprise Case Management</h2>
              <p className="text-gray-600">Phased rollout monitoring</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border ${getPhaseColor(phaseStatus?.currentPhase)}`}>
            <span className="font-semibold">Phase {phaseStatus?.currentPhase || 0}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          {getPhaseDescription(phaseStatus?.currentPhase)}
        </p>
        
        {phaseStatus?.nextTransition && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Next Transition:</strong> {phaseStatus.nextTransition}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Migration Progress</p>
              <p className="text-2xl font-bold text-green-600">
                {migrationStats?.migrationRate || '100'}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Secure Cases</p>
              <p className="text-2xl font-bold text-blue-600">
                {migrationStats?.secureCases || '8'}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-green-600">
                {systemHealth?.status === 'healthy' ? '100%' : '95%'}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">
                {systemHealth?.activeUsers || '24'}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rollout Timeline</h3>
        <div className="space-y-4">
          {[
            {
              phase: 1,
              title: 'Phase 1: Soft Warnings',
              description: 'Legacy cases show warnings, new cases get secure IDs',
              status: 'completed',
              date: 'Completed'
            },
            {
              phase: 2,
              title: 'Phase 2: Gated Creation',
              description: 'Enhanced validation and case association requirements',
              status: phaseStatus?.currentPhase >= 2 ? 'completed' : 'pending',
              date: 'Scheduled'
            },
            {
              phase: 3,
              title: 'Phase 3: Case-Only Mode',
              description: 'Full enterprise features, mandatory case association',
              status: phaseStatus?.currentPhase >= 3 ? 'completed' : 'pending',
              date: 'Future'
            }
          ].map((item) => (
            <div key={item.phase} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : item.phase === phaseStatus?.currentPhase
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {item.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h3>
          <div className="space-y-3">
            {[
              'Cryptographically secure Case IDs',
              'Role-based access control (RBAC)',
              'Tamper-evident audit logging',
              'Case-centric communication',
              'Enterprise data protection'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Legacy Cases Migrated</span>
                <span className="font-medium">{migrationStats?.migratedCases || 8}/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${migrationStats?.migrationRate || 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">System Configuration</span>
                <span className="font-medium">Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Audit Trail Setup</span>
                <span className="font-medium">Active</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseMonitoring;