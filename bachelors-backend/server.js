const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('./config/db'); // Corrected import path to db.js

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5000' }));

// Serve uploads directory statically to allow access to uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Remove global express.json() to avoid conflict with multer for multipart/form-data
// Apply express.json() only to non-multipart routes if needed

const roomRoutes = require('./routes/roomroutes');
const authRoutes = require('./routes/authroutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/auth', express.json(), authRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the main frontend page on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'interface.html'));
});

// Serve interface.html explicitly
app.get('/interface.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'interface.html'));
});

// Serve roomowners.html explicitly
app.get('/roomowners.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'roomowners.html'));
});

// Start the server after mongoose connection is established
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
