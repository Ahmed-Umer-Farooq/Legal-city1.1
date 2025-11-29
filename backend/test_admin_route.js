const express = require('express');
const app = express();

// Test if admin routes load without error
try {
  const adminRoutes = require('./routes/admin');
  console.log('✅ Admin routes loaded successfully');
  
  // Test if admin controller loads
  const adminController = require('./controllers/adminController');
  console.log('✅ Admin controller loaded successfully');
  console.log('Available functions:', Object.keys(adminController));
  
} catch (error) {
  console.error('❌ Error loading admin routes/controller:', error.message);
  console.error('Full error:', error);
}

process.exit(0);