const db = require('./db');

async function testQuery() {
  try {
    const blogs = await db('blogs')
      .where('status', 'published')
      .select(
        'id',
        'secure_id',
        'title',
        'slug'
      )
      .limit(1);
    
    console.log('Direct query result:', blogs[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testQuery();
