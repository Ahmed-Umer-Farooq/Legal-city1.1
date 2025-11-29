const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testEndpoint(name, method, url, data = null, headers = {}) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   ${method.toUpperCase()} ${url}`);
    
    let response;
    if (method === 'get') {
      response = await axios.get(url, { headers });
    } else if (method === 'post') {
      response = await axios.post(url, data, { headers });
    } else if (method === 'put') {
      response = await axios.put(url, data, { headers });
    }
    
    console.log(`✅ ${name} - SUCCESS`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    return response.data;
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Status: ${error.response?.status || 'No response'}`);
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function runBasicTests() {
  console.log('🚀 Testing Basic Authentication Endpoints...\n');
  
  // Test server health
  await testEndpoint('Server Health', 'get', `${API_BASE.replace('/api', '')}/health`);
  
  // Test registration with unique email
  const uniqueEmail = `test${Date.now()}@example.com`;
  const testUser = {
    name: 'Test User',
    username: `testuser${Date.now()}`,
    email: uniqueEmail,
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
  
  const regResult = await testEndpoint('User Registration', 'post', `${API_BASE}/auth/register`, testUser);
  
  if (regResult) {
    // Test OTP sending
    await testEndpoint('Send OTP', 'post', `${API_BASE}/auth/send-otp`, { email: uniqueEmail });
    
    // Test email verification (will fail with wrong code)
    await testEndpoint('Verify Email', 'post', `${API_BASE}/auth/verify-email`, { 
      email: uniqueEmail, 
      code: '123456' 
    });
  }
  
  // Test login with existing user (Ahmad Umer)
  const loginResult = await testEndpoint('Login Test', 'post', `${API_BASE}/auth/login`, {
    email: 'ahmad@example.com',
    password: 'password123'
  });
  
  if (loginResult && loginResult.token) {
    const token = loginResult.token;
    console.log(`   Token received: ${token.substring(0, 20)}...`);
    
    // Test protected endpoints
    await testEndpoint('Get Profile', 'get', `${API_BASE}/auth/me`, null, {
      'Authorization': `Bearer ${token}`
    });
    
    await testEndpoint('Chat Conversations', 'get', `${API_BASE}/chat/conversations`, null, {
      'Authorization': `Bearer ${token}`
    });
    
    await testEndpoint('Unread Count', 'get', `${API_BASE}/chat/unread-count`, null, {
      'Authorization': `Bearer ${token}`
    });
  }
  
  console.log('\n🎉 Basic tests completed!');
}

runBasicTests().catch(console.error);