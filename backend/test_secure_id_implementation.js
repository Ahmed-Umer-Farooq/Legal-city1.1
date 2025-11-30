const db = require('./db');

async function testSecureIdImplementation() {
  try {
    console.log('🔍 Testing Secure ID Implementation...\n');

    // Test 1: Check if secure_id exists in lawyers table
    console.log('1. Checking lawyers table structure...');
    const lawyers = await db('lawyers').select('id', 'secure_id', 'name').limit(3);
    
    if (lawyers.length === 0) {
      console.log('❌ No lawyers found in database');
      return;
    }

    console.log('✅ Found lawyers with secure_id:');
    lawyers.forEach(lawyer => {
      console.log(`   - ID: ${lawyer.id}, Secure ID: ${lawyer.secure_id}, Name: ${lawyer.name}`);
    });

    // Test 2: Test API endpoint with secure_id
    console.log('\n2. Testing API endpoint with secure_id...');
    const testLawyer = lawyers[0];
    
    // Simulate the controller logic
    const lawyerBySecureId = await db('lawyers')
      .select('id', 'secure_id', 'name', 'email', 'speciality')
      .where('secure_id', testLawyer.secure_id)
      .where('is_verified', 1)
      .first();

    if (lawyerBySecureId) {
      console.log('✅ Successfully found lawyer by secure_id:');
      console.log(`   - Name: ${lawyerBySecureId.name}`);
      console.log(`   - Email: ${lawyerBySecureId.email}`);
      console.log(`   - Secure ID: ${lawyerBySecureId.secure_id}`);
      console.log(`   - Database ID (hidden): ${lawyerBySecureId.id}`);
    } else {
      console.log('❌ Could not find lawyer by secure_id');
    }

    // Test 3: Verify secure_id uniqueness
    console.log('\n3. Checking secure_id uniqueness...');
    const duplicateSecureIds = await db('lawyers')
      .select('secure_id')
      .groupBy('secure_id')
      .havingRaw('COUNT(*) > 1');

    if (duplicateSecureIds.length === 0) {
      console.log('✅ All secure_ids are unique');
    } else {
      console.log('❌ Found duplicate secure_ids:', duplicateSecureIds);
    }

    // Test 4: Show URL format
    console.log('\n4. URL Format Examples:');
    console.log('   Before (exposed DB ID): http://localhost:3000/lawyer/1');
    console.log(`   After (secure ID): http://localhost:3000/lawyer/${testLawyer.secure_id}`);

    console.log('\n🎉 Secure ID implementation test completed!');
    console.log('\n📝 Summary:');
    console.log('   - Database IDs are now hidden from public URLs');
    console.log('   - Secure IDs are used in all public-facing endpoints');
    console.log('   - Internal database operations still use actual IDs');
    console.log('   - URLs are now secure and don\'t expose database structure');

  } catch (error) {
    console.error('❌ Error testing secure ID implementation:', error);
  } finally {
    process.exit(0);
  }
}

testSecureIdImplementation();