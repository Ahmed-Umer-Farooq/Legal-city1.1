// Test script for blog routes
// Run with: node test_blog_routes.js

const baseUrl = 'http://localhost:5001';

console.log('🧪 Blog Routes Test Guide\n');

console.log('📋 PUBLIC ROUTES (No Auth Required):');
console.log(`GET ${baseUrl}/api/blogs - Get all published blogs`);
console.log(`GET ${baseUrl}/api/blogs/2 - Get blog by ID`);
console.log(`GET ${baseUrl}/api/blogs/categories - Get categories`);
console.log(`GET ${baseUrl}/api/blogs/popular - Get popular blogs`);
console.log(`GET ${baseUrl}/api/blogs/tags - Get tags`);
console.log(`GET ${baseUrl}/api/blog-categories - Legacy categories endpoint\n`);

console.log('🔐 LAWYER ROUTES (Require Auth + Lawyer Role):');
console.log(`POST ${baseUrl}/api/blogs - Create blog`);
console.log('Headers: Authorization: Bearer <token>');
console.log('Body: { "title": "Test Blog", "content": "Content", "category": "Legal" }\n');

console.log(`PUT ${baseUrl}/api/blogs/2 - Update blog`);
console.log('Headers: Authorization: Bearer <token>');
console.log('Body: { "title": "Updated Title", "status": "pending" }\n');

console.log(`DELETE ${baseUrl}/api/blogs/2 - Delete blog`);
console.log('Headers: Authorization: Bearer <token>\n');

console.log(`GET ${baseUrl}/api/lawyer/blogs - Get lawyer's own blogs`);
console.log('Headers: Authorization: Bearer <token>\n');

console.log('🔑 To get auth token:');
console.log(`POST ${baseUrl}/api/auth/login`);
console.log('Body: { "email": "lawyer@example.com", "password": "password" }');
console.log('Copy the token from response and use in Authorization header\n');

console.log('✅ Expected Responses:');
console.log('- 200: Success');
console.log('- 401: Authentication required');
console.log('- 403: Insufficient permissions (not lawyer/admin)');
console.log('- 404: Blog not found');
console.log('- 500: Server error');