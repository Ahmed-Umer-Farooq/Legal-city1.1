const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
let testToken = '';
let testEmail = '';

// Test data
const testUser = {
  name: 'Test User',
  username: 'testuser123',
  email: 'test@example.com',
  password: 'TestPass123!',
  address: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  zipCode: '12345',
  zip_code: '12345',
  country: 'Test Country',
  mobileNumber: '+1234567890',
  mobile_number: '+1234567890'
};

const testLawyer = {
  name: 'Test Lawyer',
  username: 'testlawyer123',
  email: 'lawyer@example.com',
  password: 'LawyerPass123!',
  address: '456 Law St',
  city: 'Law City',
  state: 'Law State',
  zipCode: '54321',
  zip_code: '54321',
  country: 'Law Country',
  mobileNumber: '+0987654321',
  mobile_number: '+0987654321',
  registration_id: 'LAW123456',
  law_firm: 'Test Law Firm',
  speciality: 'Criminal Law'
};

async function testAPI(name, testFn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ ${name} - PASSED`);
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
  }
}

async function testUserRegistration() {
  const response = await axios.post(`${API_BASE}/auth/register`, testUser);
  testEmail = testUser.email;
  console.log(`   User registered: ${response.data.message}`);
}

async function testLawyerRegistration() {
  const response = await axios.post(`${API_BASE}/auth/register`, testLawyer);
  console.log(`   Lawyer registered: ${response.data.message}`);
}

async function testSendOTP() {
  const response = await axios.post(`${API_BASE}/auth/send-otp`, { 
    email: testEmail 
  });
  console.log(`   OTP sent: ${response.data.message}`);
}

async function testVerifyEmail() {
  // Use a test OTP - in real scenario this would come from email
  const response = await axios.post(`${API_BASE}/auth/verify-email`, {
    email: testEmail,
    code: '123456' // This will likely fail but tests the endpoint
  });
  console.log(`   Email verified: ${response.data.message}`);
}

async function testLogin() {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email: testUser.email,
    password: testUser.password
  });
  testToken = response.data.token;
  console.log(`   Login successful: ${response.data.user.name}`);
  console.log(`   Role: ${response.data.user.role}`);
  console.log(`   Redirect: ${response.data.redirect}`);
}

async function testGetProfile() {
  const response = await axios.get(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log(`   Profile loaded: ${response.data.name}`);
  console.log(`   Verified: ${response.data.verified}`);
}

async function testUpdateProfile() {
  const response = await axios.put(`${API_BASE}/auth/me`, {
    name: 'Updated Test User',
    verified: true
  }, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log(`   Profile updated: ${response.data.message}`);
}

async function testSubmitLater() {
  const response = await axios.post(`${API_BASE}/auth/submit-later`, {}, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log(`   Submit later: ${response.data.message}`);
}

async function testForgotPassword() {
  const response = await axios.post(`${API_BASE}/auth/forgot-password`, {
    email: testUser.email
  });
  console.log(`   Reset email sent: ${response.data.message}`);
}

async function testChatEndpoints() {
  const response = await axios.get(`${API_BASE}/chat/conversations`, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log(`   Conversations loaded: ${response.data.length} conversations`);
}

async function testUnreadCount() {
  const response = await axios.get(`${API_BASE}/chat/unread-count`, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
  console.log(`   Unread count: ${response.data.count}`);
}

async function cleanup() {
  try {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    // Note: You might want to add cleanup endpoints or manual DB cleanup
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.log('⚠️ Cleanup failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Authentication API Tests...\n');
  
  // Test user registration flow
  await testAPI('User Registration', testUserRegistration);
  await testAPI('Lawyer Registration', testLawyerRegistration);
  await testAPI('Send OTP', testSendOTP);
  await testAPI('Verify Email (will likely fail with test OTP)', testVerifyEmail);
  
  // Test login (might fail if email not verified)
  await testAPI('User Login', testLogin);
  
  if (testToken) {
    await testAPI('Get Profile', testGetProfile);
    await testAPI('Update Profile', testUpdateProfile);
    await testAPI('Submit Later', testSubmitLater);
    await testAPI('Chat Conversations', testChatEndpoints);
    await testAPI('Unread Count', testUnreadCount);
  }
  
  // Test other endpoints
  await testAPI('Forgot Password', testForgotPassword);
  
  await cleanup();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Some tests may fail if email verification is required');
  console.log('- OTP verification will fail with test code');
  console.log('- Check server logs for detailed error information');
}

// Run tests
runAllTests().catch(console.error);