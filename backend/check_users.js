const db = require('./db');

async function checkUsers() {
  try {
    const users = await db('users').where({ email: 'admin@example.com' });
    console.log('Users with email admin@example.com:', users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkUsers();
