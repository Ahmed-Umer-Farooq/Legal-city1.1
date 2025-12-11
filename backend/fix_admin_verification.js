const db = require('./db');

async function fixAdminVerification() {
  try {
    console.log('🔧 Fixing admin user verification...\n');

    // Update user ID 1 to be verified
    const updated = await db('users')
      .where('id', 1)
      .update({
        is_verified: 1,
        updated_at: db.fn.now()
      });

    if (updated) {
      console.log('✅ Admin user (ID: 1) has been verified');
      
      // Verify the update
      const user = await db('users').where('id', 1).first();
      console.log('📋 Updated user details:');
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  is_admin: ${user.is_admin}`);
      console.log(`  is_verified: ${user.is_verified}`);
    } else {
      console.log('❌ No user found with ID 1');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin verification:', error);
    process.exit(1);
  }
}

fixAdminVerification();