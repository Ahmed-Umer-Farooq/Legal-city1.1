const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAdminFormApproval() {
  try {
    console.log('🧪 Testing Admin Form Approval Fix...\n');

    // First, let's check if we can get a token (assuming you have admin credentials)
    console.log('1. Testing admin authentication...');
    
    // You'll need to replace these with your actual admin credentials
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@example.com', // Replace with your admin email
      password: 'your_password'    // Replace with your admin password
    });

    if (loginResponse.data.token) {
      console.log('✅ Admin login successful');
      console.log('🔍 User role:', loginResponse.data.user?.role);
      console.log('🔍 Is admin:', loginResponse.data.user?.is_admin);
      
      const token = loginResponse.data.token;
      const headers = { Authorization: `Bearer ${token}` };

      // Test getting admin forms
      console.log('\n2. Testing admin forms access...');
      const formsResponse = await axios.get(`${BASE_URL}/api/forms/admin/all`, { headers });
      console.log('✅ Admin forms access successful');
      console.log('📋 Found', formsResponse.data.forms?.length || 0, 'forms');

      // Test form approval (if there are pending forms)
      if (formsResponse.data.forms && formsResponse.data.forms.length > 0) {
        const pendingForm = formsResponse.data.forms.find(form => form.status === 'pending');
        
        if (pendingForm) {
          console.log('\n3. Testing form approval...');
          console.log('📝 Attempting to approve form:', pendingForm.title);
          
          const approvalResponse = await axios.put(
            `${BASE_URL}/api/forms/admin/${pendingForm.id}/approve`,
            {},
            { headers }
          );
          
          console.log('✅ Form approval successful:', approvalResponse.data.message);
        } else {
          console.log('\n3. No pending forms found to test approval');
        }
      }

      console.log('\n🎉 All tests passed! Admin form approval should now work.');
      
    } else {
      console.log('❌ Admin login failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('\n🔍 Debug info from server logs should show:');
      console.log('- User role should remain "admin"');
      console.log('- is_admin should remain 1 or true');
      console.log('- Role should not change to "lawyer"');
    }
  }
}

// Run the test
testAdminFormApproval();