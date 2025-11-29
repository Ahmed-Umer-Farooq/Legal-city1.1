require('dotenv').config();

// Test Google OAuth credentials
console.log('🧪 Testing Google OAuth Setup...\n');

console.log('Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Test database connection
const db = require('./db');
db.raw('SELECT 1')
  .then(() => {
    console.log('\n✅ Database connection: OK');
    process.exit(0);
  })
  .catch(err => {
    console.log('\n❌ Database connection failed:', err.message);
    process.exit(1);
  });