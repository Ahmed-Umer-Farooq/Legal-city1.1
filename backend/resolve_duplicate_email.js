const db = require('./db');

async function resolveDuplicateEmail() {
  try {
    const email = 'tbumer38@gmail.com';
    console.log(`🔧 Resolving duplicate email: ${email}`);
    
    // Get both records
    const userRecord = await db('users').where({ email }).first();
    const lawyerRecord = await db('lawyers').where({ email }).first();
    
    if (!userRecord || !lawyerRecord) {
      console.log('❌ Duplicate not found');
      return;
    }
    
    console.log('📊 Current status:');
    console.log(`   User: ID=${userRecord.id}, profile_completed=${userRecord.profile_completed}`);
    console.log(`   Lawyer: ID=${lawyerRecord.id}, profile_completed=${lawyerRecord.profile_completed}, reg_id=${lawyerRecord.registration_id}`);
    
    // Since lawyer account has registration_id and both are complete,
    // we'll keep the lawyer account and remove the user account
    console.log('\n🗑️  Removing user account (keeping lawyer account)...');
    
    const deleted = await db('users').where({ email }).del();
    console.log(`✅ Deleted ${deleted} user record(s)`);
    
    // Verify the fix
    const remainingUser = await db('users').where({ email }).first();
    const remainingLawyer = await db('lawyers').where({ email }).first();
    
    console.log('\n✅ After cleanup:');
    console.log(`   User records: ${remainingUser ? 1 : 0}`);
    console.log(`   Lawyer records: ${remainingLawyer ? 1 : 0}`);
    
    if (!remainingUser && remainingLawyer) {
      console.log('🎉 Duplicate resolved! Email now exists only in lawyers table.');
    }
    
  } catch (error) {
    console.error('❌ Error resolving duplicate:', error);
  } finally {
    process.exit(0);
  }
}

resolveDuplicateEmail();