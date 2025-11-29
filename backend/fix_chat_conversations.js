const db = require('./db');

async function fixChatConversations() {
  try {
    console.log('🔧 Fixing chat conversations...\n');
    
    // Find all unique partner combinations in chat messages
    const conversations = await db('chat_messages')
      .select('sender_id', 'sender_type', 'receiver_id', 'receiver_type')
      .groupBy('sender_id', 'sender_type', 'receiver_id', 'receiver_type');
    
    console.log(`Found ${conversations.length} unique conversation pairs`);
    
    let invalidMessages = 0;
    
    for (const conv of conversations) {
      // Check if sender exists
      const senderTable = conv.sender_type === 'lawyer' ? 'lawyers' : 'users';
      const sender = await db(senderTable).where('id', conv.sender_id).first();
      
      // Check if receiver exists
      const receiverTable = conv.receiver_type === 'lawyer' ? 'lawyers' : 'users';
      const receiver = await db(receiverTable).where('id', conv.receiver_id).first();
      
      if (!sender) {
        console.log(`❌ Invalid sender: ${conv.sender_id} (${conv.sender_type}) - not found in ${senderTable}`);
        invalidMessages++;
      }
      
      if (!receiver) {
        console.log(`❌ Invalid receiver: ${conv.receiver_id} (${conv.receiver_type}) - not found in ${receiverTable}`);
        invalidMessages++;
      }
      
      if (sender && receiver) {
        console.log(`✅ Valid conversation: ${sender.name} (${conv.sender_type}) <-> ${receiver.name} (${conv.receiver_type})`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Total conversations: ${conversations.length}`);
    console.log(`  Invalid references: ${invalidMessages}`);
    
    // Show current real lawyers for reference
    const realLawyers = await db('lawyers').select('id', 'name', 'email').orderBy('id');
    console.log(`\n⚖️ Available lawyers:`);
    realLawyers.forEach(lawyer => {
      console.log(`  ID: ${lawyer.id}, Name: ${lawyer.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixChatConversations();