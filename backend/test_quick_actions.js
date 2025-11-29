const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const testData = {
  // You'll need to replace this with a valid JWT token from a lawyer account
  token: 'your_jwt_token_here',
  
  // Test client data
  client: {
    name: 'Test Client',
    email: 'testclient@example.com',
    username: 'testclient',
    mobile_number: '+1234567890',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    country: 'USA'
  },
  
  // Test contact data
  contact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company: 'Test Company',
    title: 'Manager',
    address: '456 Contact Ave',
    type: 'client'
  },
  
  // Test case data
  case: {
    title: 'Test Case',
    type: 'civil',
    description: 'Test case description',
    filing_date: '2024-01-15'
  },
  
  // Test event data
  event: {
    title: 'Client Meeting',
    description: 'Initial consultation',
    start_date: '2024-01-20',
    start_time: '10:00',
    end_date: '2024-01-20',
    end_time: '11:00',
    location: 'Office',
    event_type: 'meeting'
  },
  
  // Test task data
  task: {
    title: 'Review Documents',
    description: 'Review client documents',
    due_date: '2024-01-25',
    priority: 'high',
    status: 'pending'
  },
  
  // Test note data
  note: {
    title: 'Client Notes',
    content: 'Important client information',
    is_private: false
  },
  
  // Test call data
  call: {
    title: 'Client Call',
    description: 'Discussed case details',
    call_date: '2024-01-15',
    duration_minutes: 30,
    call_type: 'consultation',
    is_billable: true,
    billable_rate: 150.00
  },
  
  // Test message data
  message: {
    subject: 'Case Update',
    content: 'Case status update',
    recipient_type: 'client'
  },
  
  // Test time entry data
  timeEntry: {
    description: 'Document review',
    hours: 2.5,
    billable_rate: 150.00,
    date: '2024-01-15',
    is_billable: true
  },
  
  // Test expense data
  expense: {
    category: 'Travel',
    description: 'Client meeting travel',
    amount: 25.50,
    date: '2024-01-15',
    is_billable: true
  },
  
  // Test invoice data
  invoice: {
    invoice_number: 'INV-001',
    amount: 1500.00,
    due_date: '2024-02-15',
    status: 'draft',
    description: 'Legal services'
  },
  
  // Test payment data
  payment: {
    amount: 500.00,
    payment_date: '2024-01-15',
    payment_method: 'check',
    reference_number: 'CHK-001'
  }
};

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${testData.token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
};

// Test functions for each Quick Action
const testQuickActions = async () => {
  console.log('🚀 Testing All 12 Quick Actions APIs\n');
  
  let createdIds = {};
  
  // 1. Test New Client
  console.log('1️⃣  Testing New Client API...');
  const clientResult = await makeRequest('POST', '/clients', testData.client);
  if (clientResult.success) {
    createdIds.clientId = clientResult.data.data.id;
    console.log('✅ Client created successfully');
  } else {
    console.log('❌ Client creation failed:', clientResult.error);
  }
  
  // 2. Test New Contact
  console.log('\n2️⃣  Testing New Contact API...');
  const contactResult = await makeRequest('POST', '/contacts', testData.contact);
  if (contactResult.success) {
    createdIds.contactId = contactResult.data.data.id;
    console.log('✅ Contact created successfully');
  } else {
    console.log('❌ Contact creation failed:', contactResult.error);
  }
  
  // 3. Test New Matter (Case)
  console.log('\n3️⃣  Testing New Matter (Case) API...');
  const caseData = { ...testData.case };
  if (createdIds.clientId) {
    caseData.client_id = createdIds.clientId;
  }
  const caseResult = await makeRequest('POST', '/cases', caseData);
  if (caseResult.success) {
    createdIds.caseId = caseResult.data.data.id;
    console.log('✅ Case created successfully');
  } else {
    console.log('❌ Case creation failed:', caseResult.error);
  }
  
  // 4. Test New Event
  console.log('\n4️⃣  Testing New Event API...');
  const eventData = { ...testData.event };
  if (createdIds.caseId) {
    eventData.case_id = createdIds.caseId;
  }
  const eventResult = await makeRequest('POST', '/events', eventData);
  if (eventResult.success) {
    createdIds.eventId = eventResult.data.data.id;
    console.log('✅ Event created successfully');
  } else {
    console.log('❌ Event creation failed:', eventResult.error);
  }
  
  // 5. Test New Task
  console.log('\n5️⃣  Testing New Task API...');
  const taskData = { ...testData.task };
  if (createdIds.caseId) {
    taskData.case_id = createdIds.caseId;
  }
  const taskResult = await makeRequest('POST', '/tasks', taskData);
  if (taskResult.success) {
    createdIds.taskId = taskResult.data.data.id;
    console.log('✅ Task created successfully');
  } else {
    console.log('❌ Task creation failed:', taskResult.error);
  }
  
  // 6. Test New Note
  console.log('\n6️⃣  Testing New Note API...');
  const noteData = { ...testData.note };
  if (createdIds.caseId) {
    noteData.case_id = createdIds.caseId;
  }
  const noteResult = await makeRequest('POST', '/notes', noteData);
  if (noteResult.success) {
    createdIds.noteId = noteResult.data.data.id;
    console.log('✅ Note created successfully');
  } else {
    console.log('❌ Note creation failed:', noteResult.error);
  }
  
  // 7. Test Log Call
  console.log('\n7️⃣  Testing Log Call API...');
  const callData = { ...testData.call };
  if (createdIds.contactId) {
    callData.contact_id = createdIds.contactId;
  }
  if (createdIds.caseId) {
    callData.case_id = createdIds.caseId;
  }
  const callResult = await makeRequest('POST', '/calls', callData);
  if (callResult.success) {
    createdIds.callId = callResult.data.data.id;
    console.log('✅ Call logged successfully');
  } else {
    console.log('❌ Call logging failed:', callResult.error);
  }
  
  // 8. Test Send Message
  console.log('\n8️⃣  Testing Send Message API...');
  const messageData = { ...testData.message };
  if (createdIds.clientId) {
    messageData.recipient_id = createdIds.clientId;
  }
  const messageResult = await makeRequest('POST', '/messages', messageData);
  if (messageResult.success) {
    createdIds.messageId = messageResult.data.data.id;
    console.log('✅ Message sent successfully');
  } else {
    console.log('❌ Message sending failed:', messageResult.error);
  }
  
  // 9. Test Track Time
  console.log('\n9️⃣  Testing Track Time API...');
  const timeData = { ...testData.timeEntry };
  if (createdIds.caseId) {
    timeData.case_id = createdIds.caseId;
  }
  const timeResult = await makeRequest('POST', '/time-entries', timeData);
  if (timeResult.success) {
    createdIds.timeEntryId = timeResult.data.data.id;
    console.log('✅ Time entry created successfully');
  } else {
    console.log('❌ Time tracking failed:', timeResult.error);
  }
  
  // 10. Test Add Expense
  console.log('\n🔟 Testing Add Expense API...');
  const expenseData = { ...testData.expense };
  if (createdIds.caseId) {
    expenseData.case_id = createdIds.caseId;
  }
  if (createdIds.clientId) {
    expenseData.client_id = createdIds.clientId;
  }
  const expenseResult = await makeRequest('POST', '/expenses', expenseData);
  if (expenseResult.success) {
    createdIds.expenseId = expenseResult.data.data.id;
    console.log('✅ Expense added successfully');
  } else {
    console.log('❌ Expense addition failed:', expenseResult.error);
  }
  
  // 11. Test New Invoice
  console.log('\n1️⃣1️⃣ Testing New Invoice API...');
  const invoiceData = { ...testData.invoice };
  if (createdIds.clientId) {
    invoiceData.client_id = createdIds.clientId;
  }
  if (createdIds.caseId) {
    invoiceData.case_id = createdIds.caseId;
  }
  const invoiceResult = await makeRequest('POST', '/invoices', invoiceData);
  if (invoiceResult.success) {
    createdIds.invoiceId = invoiceResult.data.data.id;
    console.log('✅ Invoice created successfully');
  } else {
    console.log('❌ Invoice creation failed:', invoiceResult.error);
  }
  
  // 12. Test Record Payment
  console.log('\n1️⃣2️⃣ Testing Record Payment API...');
  const paymentData = { ...testData.payment };
  if (createdIds.invoiceId) {
    paymentData.invoice_id = createdIds.invoiceId;
  }
  if (createdIds.clientId) {
    paymentData.client_id = createdIds.clientId;
  }
  const paymentResult = await makeRequest('POST', '/payments', paymentData);
  if (paymentResult.success) {
    createdIds.paymentId = paymentResult.data.data.id;
    console.log('✅ Payment recorded successfully');
  } else {
    console.log('❌ Payment recording failed:', paymentResult.error);
  }
  
  // Test GET endpoints
  console.log('\n📋 Testing GET endpoints...');
  
  const getEndpoints = [
    '/clients',
    '/contacts', 
    '/cases',
    '/events',
    '/tasks',
    '/notes',
    '/calls',
    '/messages',
    '/time-entries',
    '/expenses',
    '/invoices',
    '/payments'
  ];
  
  for (const endpoint of getEndpoints) {
    const result = await makeRequest('GET', endpoint);
    if (result.success) {
      console.log(`✅ GET ${endpoint} - Success`);
    } else {
      console.log(`❌ GET ${endpoint} - Failed:`, result.error);
    }
  }
  
  console.log('\n🎉 Quick Actions API Testing Complete!');
  console.log('\n📝 Created IDs for reference:');
  console.log(JSON.stringify(createdIds, null, 2));
};

// Instructions for running the test
console.log('📋 INSTRUCTIONS:');
console.log('1. Start your backend server: npm start');
console.log('2. Get a valid JWT token by logging in as a lawyer');
console.log('3. Replace "your_jwt_token_here" in testData.token with your actual token');
console.log('4. Run this script: node test_quick_actions.js\n');

// Uncomment the line below to run the test (after setting up the token)
// testQuickActions();

module.exports = { testQuickActions, testData };