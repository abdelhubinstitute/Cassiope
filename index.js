/**
 * Main server entry point
 */

const express = require('express');
const cors = require('cors');
const { PORT } = require('./env');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// API routes
app.use('/api/title', require('./title'));
app.use('/api/topics', require('./topics'));
app.use('/api/research', require('./research'));
app.use('/api/outline', require('./outline'));
app.use('/api/draft', require('./draft'));
app.use('/api/critique', require('./critique'));
app.use('/api/revision', require('./revision'));
app.use('/api/image', require('./image'));
app.use('/api/html', require('./html'));
app.use('/api/validate', require('./validate'));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
