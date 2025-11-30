const db = require('./db');

async function test() {
  const blogs = await db('blogs').where('status', 'published').select('*').limit(1);
  console.log('Keys:', Object.keys(blogs[0]));
  console.log('Has id:', !!blogs[0].id);
  console.log('Has secure_id:', !!blogs[0].secure_id);
  process.exit(0);
}

test();
