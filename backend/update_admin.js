const bcrypt = require('bcryptjs');
const db = require('./db');

async function makeAdmin() {
  try {
    // Find the user by name
    const user = await db('users').where({ name: 'admin' }).first();

    if (!user) {
      console.log('Admin user not found. Creating admin user...');
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      // Insert new admin user
      await db('users').insert({
        name: 'admin',
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        is_admin: true,
        email_verified: 1,
        is_active: 1,
        created_at: new Date()
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user found. Ensuring admin status...');
      // Update existing user to admin
      await db('users').where({ name: 'admin' }).update({
        role: 'admin',
        is_admin: true,
        email_verified: 1
      });
      console.log('User updated to admin successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

makeAdmin();
