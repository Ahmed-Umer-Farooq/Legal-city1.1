const db = require('./db');

async function checkLawyer44() {
  try {
    console.log('🔍 Checking lawyer ID 44...\n');
    
    // Check if lawyer 44 exists
    const lawyer = await db('lawyers').where('id', 44).first();
    console.log('Lawyer 44:', lawyer);
    
    // Check if there's a user with ID 44
    const user = await db('users').where('id', 44).first();
    console.log('User 44:', user);
    
    // Check all messages involving ID 44
    const messages = await db('chat_messages')
      .where(function() {
        this.where('sender_id', 44).orWhere('receiver_id', 44);
      })
      .select('*');
    
    console.log(`\nMessages involving ID 44 (${messages.length}):`);
    messages.forEach(msg => {
      console.log(`  ${msg.sender_id} (${msg.sender_type}) -> ${msg.receiver_id} (${msg.receiver_type}): "${msg.content}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkLawyer44();