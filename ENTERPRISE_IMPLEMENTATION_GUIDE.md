# LegalCity Enterprise Case Management Implementation Guide

## 🎯 Overview

This implementation transforms LegalCity into an enterprise-grade case management system with:
- **Secure Case IDs**: Cryptographically secure, non-sequential identifiers
- **Case-Centric Communication**: All communication tied to cases
- **Role-Based Access Control**: Granular permissions with case-scoped access
- **Comprehensive Audit Logging**: Tamper-evident compliance tracking
- **Phased Rollout**: Gradual enforcement to minimize disruption

## 🏗️ Architecture

### Core Components

1. **Secure Case ID Generator** (`utils/caseIdGenerator.js`)
   - Format: `LC-{PRACTICEAREA}-{YEAR}-{RANDOMSTRING}`
   - Uses `crypto.randomBytes(6)` for cryptographic security
   - UUID v4 for internal relationships

2. **RBAC System** (`utils/rbac.js`)
   - Role hierarchy: USER → LAWYER → SENIOR_LAWYER → CASE_MANAGER → ADMIN
   - Case-scoped permissions
   - Permission matrix enforcement

3. **Audit Logger** (`utils/auditLogger.js`)
   - Tamper-evident checksums (SHA-256)
   - Comprehensive event tracking
   - Compliance-ready exports

4. **Phase Manager** (`utils/phaseManager.js`)
   - Gradual enforcement rollout
   - Configurable transition schedules
   - Soft warnings → Gated creation → Case-only mode

## 📊 Database Schema

### Enhanced Tables

```sql
-- Cases table with secure identifiers
ALTER TABLE cases ADD COLUMN case_uuid UUID NOT NULL UNIQUE;
ALTER TABLE cases ADD COLUMN secure_case_id VARCHAR(50) NOT NULL UNIQUE;
ALTER TABLE cases ADD COLUMN practice_area ENUM(...) NOT NULL;
ALTER TABLE cases ADD COLUMN status ENUM(...) DEFAULT 'OPEN';

-- Audit logs for compliance
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  actor_id INT NOT NULL,
  actor_role ENUM(...) NOT NULL,
  case_uuid UUID,
  action ENUM(...) NOT NULL,
  entity VARCHAR(100),
  metadata JSON,
  timestamp DATETIME NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- System configuration
CREATE TABLE system_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING'
);
```

## 🚀 Implementation Steps

### Phase 1: Infrastructure Setup

1. **Run Database Migrations**
   ```bash
   cd backend
   npm run migrate:latest
   ```

2. **Install Dependencies**
   ```bash
   npm install uuid
   ```

3. **Update Environment Variables**
   ```env
   # Add to .env
   ENCRYPTION_KEY=your-32-character-encryption-key
   AUDIT_RETENTION_DAYS=2555  # 7 years for legal compliance
   ```

### Phase 2: Legacy Migration

1. **Run Migration Script**
   ```bash
   node scripts/runMigration.js
   ```

2. **Validate Results**
   - Check migration logs
   - Verify Case ID formats
   - Test rollback capability

### Phase 3: Gradual Rollout

#### Phase 1: Soft Warnings (2 weeks)
- Users see warnings for non-case communication
- All existing functionality remains
- Monitor adoption metrics

#### Phase 2: Gated Creation (4 weeks)
- New messages/documents require case association
- Existing conversations continue
- Case creation prompts for orphaned actions

#### Phase 3: Case-Only Mode (Production)
- All communication must be case-centric
- General chat disabled
- Full enterprise compliance

## 🔧 API Endpoints

### Enhanced Case Management

```javascript
// Create case with secure ID
POST /api/enhanced-cases/create
{
  "title": "Contract Dispute Resolution",
  "practice_area": "CORPORATE",
  "description": "Client contract dispute",
  "sla_days": 30
}

// Response includes secure Case ID
{
  "success": true,
  "data": {
    "secure_case_id": "LC-CORPORATE-2025-A7B9C2D1E4F8",
    "case_uuid": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Case-Centric Communication

```javascript
// Send message (requires case association)
POST /api/enhanced-chat/cases/LC-CORPORATE-2025-A7B9C2D1E4F8/messages
{
  "content": "Case update: Discovery phase completed",
  "message_type": "text",
  "is_internal_note": false
}

// Get case conversations
GET /api/enhanced-chat/conversations
// Returns only case-associated conversations
```

### Admin Analytics

```javascript
// Dashboard analytics
GET /api/admin/reports/dashboard?period=30

// Compliance monitoring
GET /api/admin/reports/compliance
// Returns SLA breaches, stale cases, audit anomalies
```

## 🔒 Security Features

### Encryption at Rest

1. **Database-Level TDE**
   - Enable Transparent Data Encryption
   - Encrypt all tables and backups

2. **Application-Level Encryption**
   ```javascript
   // Sensitive fields encrypted with AES-256-GCM
   const crypto = require('crypto');
   const algorithm = 'aes-256-gcm';
   const key = process.env.ENCRYPTION_KEY;
   ```

### Audit Trail Integrity

```javascript
// Tamper-evident checksums
function generateAuditChecksum(auditData) {
  const dataString = JSON.stringify(auditData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
}
```

## 👥 Role-Based Access Control

### Permission Matrix

| Role | View Case | Edit Case | Close Case | Upload Docs | Send Messages | Manage Assignments |
|------|-----------|-----------|------------|-------------|---------------|-------------------|
| USER | ✓ (own) | ✗ | ✗ | ✗ | ✓ | ✗ |
| LAWYER | ✓ (assigned) | ✓ | ✗ | ✓ | ✓ | ✗ |
| SENIOR_LAWYER | ✓ (assigned) | ✓ | ✓ | ✓ | ✓ | ✗ |
| CASE_MANAGER | ✓ (all) | ✓ | ✗ | ✓ | ✓ | ✓ |
| ADMIN | ✓ (all) | ✓ | ✓ | ✓ | ✓ | ✓ |

### Case-Scoped Access

```javascript
// Only assigned participants can access case resources
async function getCaseAccess(userId, userRole, caseUuid) {
  const caseData = await db('cases').where('case_uuid', caseUuid).first();
  
  if (userRole === 'ADMIN') return true;
  if (userRole === 'LAWYER' && caseData.assigned_lawyer_id === userId) return true;
  if (userRole === 'USER' && caseData.client_id === userId) return true;
  
  return false;
}
```

## 📈 Monitoring & Compliance

### Key Metrics

1. **Case Volume by Practice Area**
2. **SLA Compliance Rate**
3. **Lawyer Workload Distribution**
4. **Audit Trail Completeness**
5. **Phase Adoption Rates**

### Compliance Alerts

- Cases approaching SLA deadline
- Stale cases (no activity > 14 days)
- Audit anomalies (multiple IP logins)
- Missing audit entries

### Export & Retention

```javascript
// Automated compliance exports
GET /api/admin/reports/audit?format=csv&start_date=2024-01-01&end_date=2024-12-31

// Retention policy enforcement
// Automatically archive audit logs > 7 years
```

## 🔄 Migration & Rollback

### Safe Migration Process

1. **Backup Database**
2. **Run Dry Migration** (test mode)
3. **Validate Results**
4. **Execute Migration**
5. **Save Rollback Data**

### Rollback Capability

```javascript
// Rollback specific cases
const { rollbackMigration } = require('./utils/migrationTool');
const rollbackData = JSON.parse(fs.readFileSync('migration-rollback-123456.json'));
await rollbackMigration(rollbackData);
```

## 🎛️ Admin Controls

### Phase Management

```javascript
// Set enforcement phase
POST /api/admin/system/phase
{ "phase": "PHASE_2" }

// Schedule automatic transitions
POST /api/admin/system/schedule
{
  "phase_1_duration": 14,
  "phase_2_duration": 30,
  "auto_transition": true
}
```

### System Configuration

```javascript
// Update system settings
POST /api/admin/system/config
{
  "audit_retention_days": 2555,
  "sla_default_days": 30,
  "encryption_enabled": true
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Migration Failures**
   - Check database permissions
   - Verify practice area mappings
   - Review error logs

2. **Phase Transition Problems**
   - Validate user training completion
   - Check adoption metrics
   - Adjust transition timeline

3. **Performance Issues**
   - Add database indexes
   - Optimize audit queries
   - Implement caching

### Support Commands

```bash
# Validate migration integrity
node scripts/validateMigration.js

# Check phase compliance
node scripts/checkPhaseCompliance.js

# Generate compliance report
node scripts/generateComplianceReport.js
```

## 📞 Support & Maintenance

### Regular Tasks

1. **Weekly**: Review SLA compliance
2. **Monthly**: Audit trail validation
3. **Quarterly**: Security assessment
4. **Annually**: Compliance certification

### Emergency Procedures

1. **Security Breach**: Immediate audit log export
2. **Data Corruption**: Rollback to last known good state
3. **Performance Issues**: Scale infrastructure, optimize queries

---

## ✅ Implementation Checklist

- [ ] Database migrations completed
- [ ] Legacy cases migrated
- [ ] Phase 1 deployment (soft warnings)
- [ ] User training completed
- [ ] Phase 2 deployment (gated creation)
- [ ] Compliance monitoring active
- [ ] Phase 3 deployment (case-only mode)
- [ ] Full enterprise compliance achieved

**🎉 Congratulations! LegalCity is now enterprise-ready with secure case management, comprehensive audit trails, and role-based access control.**