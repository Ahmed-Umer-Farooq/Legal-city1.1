const express = require('express');
const path = require('path');
const formsController = require('./controllers/formsController');

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/test-download/:id', formsController.downloadForm);

const PORT = 5004;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test download URL: http://localhost:${PORT}/test-download/11`);
  console.log('Press Ctrl+C to stop');
});