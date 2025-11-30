const blogController = require('./controllers/blogController');

const mockReq = { query: { limit: 1 } };
const mockRes = {
  json: (data) => {
    console.log('Response data:', JSON.stringify(data, null, 2));
    console.log('First blog keys:', Object.keys(data[0] || {}));
    console.log('Has id:', !!data[0]?.id);
    console.log('Has secure_id:', !!data[0]?.secure_id);
    process.exit(0);
  },
  status: () => mockRes
};

blogController.getAllBlogs(mockReq, mockRes);
