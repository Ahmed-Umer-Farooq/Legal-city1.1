const db = require('./db');

async function testAppointmentCreation() {
  try {
    console.log('Testing appointment creation...');
    
    // Test direct database insert
    const testData = {
      title: 'meeting',
      description: 'meeting',
      appointment_type: 'consultation',
      appointment_date: '2024-12-04',
      appointment_time: '12:41',
      user_id: 1,
      lawyer_name: 'ghazi',
      status: 'scheduled'
    };
    
    console.log('Inserting:', testData);
    
    const [appointmentId] = await db('user_appointments').insert(testData);
    console.log('✅ Created appointment with ID:', appointmentId);
    
    const appointment = await db('user_appointments').where({ id: appointmentId }).first();
    console.log('✅ Retrieved appointment:', appointment);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

testAppointmentCreation();