require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create a test admin token
const adminUser = {
  id: 1,
  email: 'admin@example.com',
  role: 'admin',
  is_admin: 1
};

const token = jwt.sign(adminUser, process.env.JWT_SECRET || 'dev_secret_key_for_localhost_only_change_for_production');

console.log('Test admin token:', token);
console.log('\nTest with curl:');
console.log(`curl -H "Authorization: Bearer ${token}" "http://localhost:5001/api/admin/stats"`);

process.exit(0);