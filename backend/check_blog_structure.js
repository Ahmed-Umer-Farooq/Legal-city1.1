const db = require('./db');

async function checkBlogStructure() {
  try {
    const blog = await db('blogs').first();
    console.log('📊 Blog columns:', Object.keys(blog || {}));
    console.log('📝 Sample blog:', blog);
    
    const hasSecureId = await db.schema.hasColumn('blogs', 'secure_id');
    console.log('\n✅ Has secure_id column:', hasSecureId);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkBlogStructure();
