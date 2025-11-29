const db = require('./db');

async function testChatSystem() {
  try {
    console.log('🔍 Testing Chat System...');
    
    // Test 1: Check if chat_messages table exists
    console.log('\n1. Checking chat_messages table...');
    const tableExists = await db.schema.hasTable('chat_messages');
    console.log(`   Table exists: ${tableExists}`);
    
    if (tableExists) {
      // Test 2: Check table structure
      console.log('\n2. Checking table structure...');
      const columns = await db('chat_messages').columnInfo();
      console.log('   Columns:', Object.keys(columns));
      
      // Test 3: Check for existing messages
      console.log('\n3. Checking existing messages...');
      const messageCount = await db('chat_messages').count('id as count').first();
      console.log(`   Total messages: ${messageCount.count}`);
      
      // Test 4: Check users table for chat participants
      console.log('\n4. Checking potential chat participants...');
      const users = await db('users').select('id', 'name', 'role').limit(5);
      console.log('   Sample users:', users);
      
      const lawyers = await db('lawyers').select('id', 'name').limit(5);
      console.log('   Sample lawyers:', lawyers);
    }
    
    console.log('\n✅ Chat system test completed!');
    
  } catch (error) {
    console.error('❌ Error testing chat system:', error);
  } finally {
    process.exit(0);
  }
}

testChatSystem();