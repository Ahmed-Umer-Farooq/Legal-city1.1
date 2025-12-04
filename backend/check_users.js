const db = require('./db');

async function checkUsers() {
  try {
    const users = await db('users').select('id', 'name', 'email').limit(5);
    console.log('Available users:', users);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit();
  }
}

checkUsers();