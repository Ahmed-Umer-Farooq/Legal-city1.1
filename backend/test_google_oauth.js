const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Flow...\n');

  try {
    // Test 1: Check if Google OAuth initiation works
    console.log('1. Testing Google OAuth initiation endpoint...');
    const response = await axios.get(`${BASE_URL}/api/auth/google?role=user`, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302 || status === 200
    });
    
    if (response.status === 302) {
      console.log('✅ Google OAuth initiation works - redirects to Google');
      console.log('   Redirect URL:', response.headers.location);
    } else {
      console.log('❌ Google OAuth initiation failed');
    }

    // Test 2: Check environment variables
    console.log('\n2. Checking environment configuration...');
    const debugResponse = await axios.get(`${BASE_URL}/api/auth/debug-oauth`);
    console.log('✅ Environment check:', debugResponse.data);

    // Test 3: Test callback URL structure
    console.log('\n3. Testing callback URL structure...');
    const callbackUrl = `${BASE_URL}/api/auth/google/callback`;
    console.log('   Callback URL:', callbackUrl);
    console.log('   Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');

    console.log('\n🎯 OAuth Flow Summary:');
    console.log('   1. User clicks Google login button');
    console.log('   2. Redirects to /api/auth/google?role=user');
    console.log('   3. Google redirects to /api/auth/google/callback');
    console.log('   4. Backend processes and redirects to frontend setup page');
    console.log('   5. Frontend completes profile and redirects to dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testGoogleOAuth();