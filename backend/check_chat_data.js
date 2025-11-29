const db = require('./db');

async function checkChatData() {
  try {
    console.log('🔍 Checking chat data...\n');
    
    // Check all chat messages
    const messages = await db('chat_messages').select('*').orderBy('created_at', 'desc').limit(10);
    console.log(`📨 Recent chat messages (${messages.length}):`);
    messages.forEach(msg => {
      console.log(`  ID: ${msg.id}, From: ${msg.sender_id} (${msg.sender_type}) -> To: ${msg.receiver_id} (${msg.receiver_type})`);
      console.log(`  Content: "${msg.content}"`);
      console.log(`  Created: ${msg.created_at}\n`);
    });
    
    // Check users table
    const users = await db('users').select('id', 'name', 'email').limit(5);
    console.log(`👥 Users (${users.length}):`);
    users.forEach(user => {
      console.log(`  ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
    // Check lawyers table
    const lawyers = await db('lawyers').select('id', 'name', 'email', 'registration_id').limit(5);
    console.log(`\n⚖️ Lawyers (${lawyers.length}):`);
    lawyers.forEach(lawyer => {
      console.log(`  ID: ${lawyer.id}, Name: ${lawyer.name}, Email: ${lawyer.email}, Reg: ${lawyer.registration_id}`);
    });
    
    // Check for any conversations involving user ID 53
    const userConversations = await db('chat_messages')
      .where(function() {
        this.where('sender_id', 53).orWhere('receiver_id', 53);
      })
      .select('*')
      .orderBy('created_at', 'desc');
    
    console.log(`\n💬 Conversations for user 53 (${userConversations.length}):`);
    userConversations.forEach(msg => {
      console.log(`  ${msg.sender_id} (${msg.sender_type}) -> ${msg.receiver_id} (${msg.receiver_type}): "${msg.content}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkChatData();