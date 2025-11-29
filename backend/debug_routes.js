const express = require('express');
const app = express();

// Test all routes
app.get('/test', (req, res) => res.json({ message: 'Basic route works' }));

// Test admin routes
app.get('/api/admin/debug', (req, res) => {
  res.json({ 
    message: 'Admin debug route works',
    timestamp: new Date(),
    routes: ['/api/admin/stats', '/api/admin/users', '/api/admin/lawyers']
  });
});

// Simple stats endpoint
app.get('/api/admin/stats', (req, res) => {
  res.json({
    stats: { totalUsers: 5, totalLawyers: 3, verifiedLawyers: 2, unverifiedLawyers: 1 },
    recentUsers: [],
    recentLawyers: []
  });
});

app.listen(5002, () => {
  console.log('Debug server running on port 5002');
  console.log('Test: http://localhost:5002/test');
  console.log('Admin debug: http://localhost:5002/api/admin/debug');
  console.log('Admin stats: http://localhost:5002/api/admin/stats');
});