const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
const testEmail = `test${Date.now()}@example.com`;

async function testSecureId() {
  try {
    console.log('🧪 Testing secure_id after server restart...\n');

    // Register new user
    console.log('1️⃣ Registering new user...');
    await axios.post(`${BASE_URL}/auth/register-user`, {
      name: 'Test User',
      email: testEmail,
      password: 'Test@123456'
    });
    console.log('✅ User registered');

    // Check database
    const db = require('./db');
    const user = await db('users').where({ email: testEmail }).first();
    
    console.log('\n2️⃣ Checking database:');
    console.log(`✅ User has secure_id: ${!!user.secure_id}`);
    console.log(`📝 secure_id: ${user.secure_id}`);
    console.log(`📝 secure_id length: ${user.secure_id?.length || 0}`);

    // Verify and login
    await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: testEmail,
      code: user.email_verification_code
    });

    console.log('\n3️⃣ Testing login response:');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'Test@123456'
    });
    
    console.log(`✅ Login successful`);
    console.log(`📝 Response has secure_id: ${!!loginRes.data.user.secure_id}`);
    console.log(`📝 secure_id in response: ${loginRes.data.user.secure_id}`);

    // Cleanup
    await db('users').where({ email: testEmail }).del();
    console.log('\n✅ Test complete - secure_id is working!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSecureId();
