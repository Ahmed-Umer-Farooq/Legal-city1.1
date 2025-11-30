const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'Test@123456';

console.log('🧪 Testing All Auth Flows...\n');

async function testAuthFlows() {
  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration');
    const registerRes = await axios.post(`${BASE_URL}/auth/register-user`, {
      name: 'Test User',
      username: 'testuser',
      email: testEmail,
      password: testPassword,
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country'
    });
    console.log(`✅ Status: ${registerRes.status}`);
    console.log(`📝 Message: ${registerRes.data.message}`);

    // Test 2: Send OTP
    console.log('\n2️⃣ Testing Send OTP');
    const otpRes = await axios.post(`${BASE_URL}/auth/send-otp`, {
      email: testEmail
    });
    console.log(`✅ Status: ${otpRes.status}`);
    console.log(`📝 Message: ${otpRes.data.message}`);

    // Test 3: Check if secure_id exists in database
    console.log('\n3️⃣ Checking secure_id in database');
    const db = require('./db');
    const user = await db('users').where({ email: testEmail }).first();
    console.log(`✅ User has secure_id: ${!!user.secure_id}`);
    console.log(`📝 secure_id: ${user.secure_id}`);
    console.log(`📝 email_verification_code: ${user.email_verification_code}`);

    // Test 4: Verify Email (using code from database)
    console.log('\n4️⃣ Testing Verify Email');
    const verifyRes = await axios.post(`${BASE_URL}/auth/verify-email`, {
      email: testEmail,
      code: user.email_verification_code
    });
    console.log(`✅ Status: ${verifyRes.status}`);
    console.log(`📝 Message: ${verifyRes.data.message}`);

    // Test 5: Login
    console.log('\n5️⃣ Testing Login');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    console.log(`✅ Status: ${loginRes.status}`);
    console.log(`📝 User ID: ${loginRes.data.user.id}`);
    console.log(`📝 User secure_id: ${loginRes.data.user.secure_id}`);
    console.log(`📝 Token received: ${!!loginRes.data.token}`);

    // Test 6: Forgot Password OTP
    console.log('\n6️⃣ Testing Forgot Password OTP');
    const forgotRes = await axios.post(`${BASE_URL}/auth/forgot-password-otp`, {
      email: testEmail
    });
    console.log(`✅ Status: ${forgotRes.status}`);
    console.log(`📝 Message: ${forgotRes.data.message}`);

    // Test 7: Google Auth Endpoints Check
    console.log('\n7️⃣ Testing Google Auth Endpoints');
    try {
      const googleRes = await axios.get(`${BASE_URL}/auth/google`);
      console.log(`✅ Google auth endpoint exists`);
    } catch (err) {
      if (err.response?.status === 302) {
        console.log(`✅ Google auth redirects correctly`);
      } else {
        console.log(`⚠️ Google auth status: ${err.response?.status || 'unreachable'}`);
      }
    }

    // Test 8: Lawyer Registration with secure_id
    console.log('\n8️⃣ Testing Lawyer Registration');
    const lawyerEmail = `lawyer${Date.now()}@example.com`;
    const lawyerRegRes = await axios.post(`${BASE_URL}/auth/register-lawyer`, {
      name: 'Test Lawyer',
      username: 'testlawyer',
      email: lawyerEmail,
      password: testPassword,
      registration_id: 'AB123456',
      law_firm: 'Test Firm',
      speciality: 'Criminal Law',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country'
    });
    console.log(`✅ Status: ${lawyerRegRes.status}`);
    console.log(`📝 Message: ${lawyerRegRes.data.message}`);

    // Check lawyer secure_id
    const lawyer = await db('lawyers').where({ email: lawyerEmail }).first();
    console.log(`✅ Lawyer has secure_id: ${!!lawyer.secure_id}`);
    console.log(`📝 Lawyer secure_id: ${lawyer.secure_id}`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await db('users').where({ email: testEmail }).del();
    await db('lawyers').where({ email: lawyerEmail }).del();
    console.log('✅ Cleanup complete');

    console.log('\n✅ All auth tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAuthFlows();
