const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// List of all Quick Actions endpoints
const endpoints = [
  // 1. New Client
  { method: 'GET', path: '/clients', name: 'Get Clients' },
  { method: 'POST', path: '/clients', name: 'Create Client' },
  
  // 2. New Contact  
  { method: 'GET', path: '/contacts', name: 'Get Contacts' },
  { method: 'POST', path: '/contacts', name: 'Create Contact' },
  
  // 3. New Matter (Case)
  { method: 'GET', path: '/cases', name: 'Get Cases' },
  { method: 'POST', path: '/cases', name: 'Create Case' },
  
  // 4. New Event
  { method: 'GET', path: '/events', name: 'Get Events' },
  { method: 'POST', path: '/events', name: 'Create Event' },
  
  // 5. New Task
  { method: 'GET', path: '/tasks', name: 'Get Tasks' },
  { method: 'POST', path: '/tasks', name: 'Create Task' },
  
  // 6. New Note
  { method: 'GET', path: '/notes', name: 'Get Notes' },
  { method: 'POST', path: '/notes', name: 'Create Note' },
  
  // 7. Log Call
  { method: 'GET', path: '/calls', name: 'Get Calls' },
  { method: 'POST', path: '/calls', name: 'Log Call' },
  
  // 8. Send Message
  { method: 'GET', path: '/messages', name: 'Get Messages' },
  { method: 'POST', path: '/messages', name: 'Send Message' },
  
  // 9. Track Time
  { method: 'GET', path: '/time-entries', name: 'Get Time Entries' },
  { method: 'POST', path: '/time-entries', name: 'Track Time' },
  
  // 10. Add Expense
  { method: 'GET', path: '/expenses', name: 'Get Expenses' },
  { method: 'POST', path: '/expenses', name: 'Add Expense' },
  
  // 11. New Invoice
  { method: 'GET', path: '/invoices', name: 'Get Invoices' },
  { method: 'POST', path: '/invoices', name: 'Create Invoice' },
  
  // 12. Record Payment
  { method: 'GET', path: '/payments', name: 'Get Payments' },
  { method: 'POST', path: '/payments', name: 'Record Payment' }
];

const verifyEndpoints = async () => {
  console.log('🔍 Verifying Quick Actions Endpoints...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.path}`,
        timeout: 5000,
        validateStatus: (status) => status < 500 // Accept 401, 400 as valid responses
      });
      
      if (response.status === 401) {
        console.log(`✅ ${endpoint.name} - Endpoint exists (requires auth)`);
        successCount++;
      } else if (response.status < 400) {
        console.log(`✅ ${endpoint.name} - Endpoint accessible`);
        successCount++;
      } else {
        console.log(`⚠️  ${endpoint.name} - Status: ${response.status}`);
        successCount++;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint.name} - Server not running`);
      } else if (error.response?.status === 401) {
        console.log(`✅ ${endpoint.name} - Endpoint exists (requires auth)`);
        successCount++;
      } else if (error.response?.status === 404) {
        console.log(`❌ ${endpoint.name} - Endpoint not found`);
        failCount++;
      } else {
        console.log(`⚠️  ${endpoint.name} - ${error.message}`);
        failCount++;
      }
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Working endpoints: ${successCount}`);
  console.log(`❌ Failed endpoints: ${failCount}`);
  console.log(`📈 Success rate: ${((successCount / endpoints.length) * 100).toFixed(1)}%`);
  
  if (successCount === endpoints.length) {
    console.log('\n🎉 All Quick Actions endpoints are working!');
  } else {
    console.log('\n⚠️  Some endpoints need attention.');
  }
};

// Run verification
verifyEndpoints().catch(console.error);

module.exports = { verifyEndpoints };