const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBlogAPIs() {
  console.log('🧪 Testing Blog APIs...\n');

  try {
    // Test 1: Get all blogs
    console.log('1️⃣ Testing GET /api/blogs');
    const blogsRes = await axios.get(`${BASE_URL}/blogs`);
    console.log(`✅ Status: ${blogsRes.status}`);
    console.log(`📊 Blogs count: ${blogsRes.data.length}`);
    
    if (blogsRes.data.length > 0) {
      const firstBlog = blogsRes.data[0];
      console.log(`📝 First blog keys:`, Object.keys(firstBlog));
      console.log(`📝 First blog summary:`, {
        id: firstBlog.id,
        secure_id: firstBlog.secure_id,
        slug: firstBlog.slug,
        title: firstBlog.title
      });

      // Test 2: Get blog by slug
      if (firstBlog.slug) {
        console.log('\n2️⃣ Testing GET /api/blogs/:slug');
        const slugRes = await axios.get(`${BASE_URL}/blogs/${firstBlog.slug}`);
        console.log(`✅ Status: ${slugRes.status}`);
        console.log(`📝 Retrieved by slug: ${slugRes.data.title}`);
      }

      // Test 3: Get blog by secure_id
      if (firstBlog.secure_id) {
        console.log('\n3️⃣ Testing GET /api/blogs/:secure_id');
        const secureRes = await axios.get(`${BASE_URL}/blogs/${firstBlog.secure_id}`);
        console.log(`✅ Status: ${secureRes.status}`);
        console.log(`📝 Retrieved by secure_id: ${secureRes.data.title}`);
      }
    }

    // Test 4: Get categories
    console.log('\n4️⃣ Testing GET /api/blogs/categories');
    const catRes = await axios.get(`${BASE_URL}/blogs/categories`);
    console.log(`✅ Status: ${catRes.status}`);
    console.log(`📊 Categories: ${catRes.data.length}`);

    // Test 5: Get popular posts
    console.log('\n5️⃣ Testing GET /api/blogs/popular');
    const popRes = await axios.get(`${BASE_URL}/blogs/popular`);
    console.log(`✅ Status: ${popRes.status}`);
    console.log(`📊 Popular posts: ${popRes.data.length}`);
    if (popRes.data.length > 0) {
      console.log(`📝 Has secure_id: ${!!popRes.data[0].secure_id}`);
      console.log(`📝 Has slug: ${!!popRes.data[0].slug}`);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testBlogAPIs();
