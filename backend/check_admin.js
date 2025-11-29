const db = require('./db');

async function checkAdmin() {
  try {
    const user = await db('users').where({ name: 'admin' }).first();
    console.log('Admin user:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkAdmin();
