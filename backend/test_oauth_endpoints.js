const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testOAuthEndpoints() {
  console.log('🚀 Testing OAuth and Additional Endpoints...\n');
  
  try {
    // Test OAuth redirect URLs (these will redirect, so we expect 302)
    console.log('🧪 Testing OAuth Redirect URLs...');
    
    try {
      await axios.get(`${API_BASE}/auth/google`);
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ Google OAuth Redirect - Working (302 redirect)');
      } else {
        console.log(`❌ Google OAuth - Status: ${error.response?.status}`);
      }
    }
    
    try {
      await axios.get(`${API_BASE}/auth/google/lawyer`);
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ Google Lawyer OAuth Redirect - Working (302 redirect)');
      } else {
        console.log(`❌ Google Lawyer OAuth - Status: ${error.response?.status}`);
      }
    }
    
    // Test password reset endpoints
    console.log('\n🧪 Testing Password Reset...');
    
    const forgotResponse = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email: 'admin@example.com'
    });
    console.log('✅ Forgot Password - SUCCESS');
    console.log(`   Message: ${forgotResponse.data.message}`);
    
    // Test with invalid reset token (will fail but tests endpoint)
    try {
      await axios.post(`${API_BASE}/auth/reset-password`, {
        token: 'invalid-token',
        password: 'NewPassword123!'
      });
    } catch (error) {
      console.log('⚠️ Reset Password - Expected failure with invalid token');
      console.log(`   Error: ${error.response?.data?.message}`);
    }
    
    // Test logout endpoint
    console.log('\n🧪 Testing Logout...');
    
    const logoutResponse = await axios.post(`${API_BASE}/auth/logout`);
    console.log('✅ Logout - SUCCESS');
    console.log(`   Message: ${logoutResponse.data.message}`);
    
    // Test refresh token (if implemented)
    console.log('\n🧪 Testing Additional Endpoints...');
    
    try {
      await axios.post(`${API_BASE}/auth/refresh-token`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️ Refresh Token - Not implemented (404)');
      } else {
        console.log(`⚠️ Refresh Token - Status: ${error.response?.status}`);
      }
    }
    
  } catch (error) {
    console.log('❌ OAuth Test Failed');
    console.log(`   Error: ${error.response?.data?.message || error.message}`);
  }
  
  console.log('\n🎉 OAuth and Additional Endpoint Tests Completed!');
}

testOAuthEndpoints().catch(console.error);