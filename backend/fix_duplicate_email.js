const db = require('./db');

async function fixDuplicateEmails() {
  try {
    console.log('🔍 Checking for duplicate emails...');
    
    // Find emails that exist in both tables
    const duplicates = await db.raw(`
      SELECT u.email, u.id as user_id, l.id as lawyer_id, 
             u.created_at as user_created, l.created_at as lawyer_created
      FROM users u 
      INNER JOIN lawyers l ON u.email = l.email
    `);
    
    console.log(`Found ${duplicates[0].length} duplicate emails:`);
    
    for (const dup of duplicates[0]) {
      console.log(`\n📧 Email: ${dup.email}`);
      console.log(`   User ID: ${dup.user_id} (created: ${dup.user_created})`);
      console.log(`   Lawyer ID: ${dup.lawyer_id} (created: ${dup.lawyer_created})`);
      
      // Check which account has more complete data
      const userRecord = await db('users').where({ id: dup.user_id }).first();
      const lawyerRecord = await db('lawyers').where({ id: dup.lawyer_id }).first();
      
      console.log(`   User profile completed: ${userRecord.profile_completed}`);
      console.log(`   Lawyer profile completed: ${lawyerRecord.profile_completed}`);
      console.log(`   User has registration_id: ${!!userRecord.registration_id}`);
      console.log(`   Lawyer has registration_id: ${!!lawyerRecord.registration_id}`);
      
      // Recommendation based on data completeness
      if (lawyerRecord.registration_id && lawyerRecord.profile_completed) {
        console.log(`   ✅ Recommend keeping LAWYER account (more complete)`);
      } else if (userRecord.profile_completed) {
        console.log(`   ✅ Recommend keeping USER account (more complete)`);
      } else {
        console.log(`   ⚠️  Both accounts incomplete - manual decision needed`);
      }
    }
    
    if (duplicates[0].length > 0) {
      console.log(`\n🛠️  To fix manually, you can:`);
      console.log(`   1. Delete the less complete account`);
      console.log(`   2. Or merge data from one account to the other`);
      console.log(`   3. Or keep both and use email+role for login`);
    } else {
      console.log('✅ No duplicate emails found');
    }
    
  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
  } finally {
    process.exit(0);
  }
}

fixDuplicateEmails();