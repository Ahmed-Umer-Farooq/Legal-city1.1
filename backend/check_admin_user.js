const db = require('./db');

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user setup...\n');

    // Check users table for admin users
    const adminUsers = await db('users')
      .where('role', 'admin')
      .orWhere('is_admin', 1)
      .select('id', 'name', 'email', 'role', 'is_admin', 'is_verified');

    console.log('👤 Admin users found in users table:');
    if (adminUsers.length > 0) {
      adminUsers.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
        console.log(`    Role: ${user.role}, is_admin: ${user.is_admin}, verified: ${user.is_verified}`);
      });
    } else {
      console.log('  No admin users found in users table');
    }

    // Check if user ID 1 exists and their details
    console.log('\n🔍 Checking user ID 1 (from your logs):');
    const user1 = await db('users').where('id', 1).first();
    if (user1) {
      console.log('  User 1 details:');
      console.log(`    Name: ${user1.name}`);
      console.log(`    Email: ${user1.email}`);
      console.log(`    Role: ${user1.role}`);
      console.log(`    is_admin: ${user1.is_admin}`);
      console.log(`    is_verified: ${user1.is_verified}`);
    } else {
      console.log('  User ID 1 not found in users table');
      
      // Check lawyers table
      const lawyer1 = await db('lawyers').where('id', 1).first();
      if (lawyer1) {
        console.log('  Found in lawyers table instead:');
        console.log(`    Name: ${lawyer1.name}`);
        console.log(`    Email: ${lawyer1.email}`);
        console.log(`    is_verified: ${lawyer1.is_verified}`);
      }
    }

    // Suggest fix if needed
    if (user1 && (user1.role !== 'admin' || user1.is_admin !== 1)) {
      console.log('\n💡 Suggested fix for user ID 1:');
      console.log('Run this SQL to make user 1 an admin:');
      console.log(`UPDATE users SET role = 'admin', is_admin = 1 WHERE id = 1;`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
    process.exit(1);
  }
}

checkAdminUser();