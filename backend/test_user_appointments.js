const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test user credentials (you'll need to use actual user credentials)
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testUserAppointments() {
  try {
    console.log('🧪 Testing User Appointments API...');
    
    // First, login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed. Please create a test user first.');
      return;
    }
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('✅ Login successful');
    
    // Test getting appointments
    console.log('2. Fetching appointments...');
    const getResponse = await axios.get(`${BASE_URL}/user/appointments`, { headers });
    console.log('✅ Get appointments:', getResponse.data);
    
    // Test creating appointment
    console.log('3. Creating new appointment...');
    const newAppointment = {
      title: 'Test Consultation',
      date: '2024-12-20',
      time: '14:00',
      type: 'consultation',
      lawyer_name: 'Test Lawyer',
      description: 'Test appointment description'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/user/appointments`, newAppointment, { headers });
    console.log('✅ Create appointment:', createResponse.data);
    
    // Test getting upcoming appointments
    console.log('4. Fetching upcoming appointments...');
    const upcomingResponse = await axios.get(`${BASE_URL}/user/appointments/upcoming`, { headers });
    console.log('✅ Upcoming appointments:', upcomingResponse.data);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testUserAppointments();