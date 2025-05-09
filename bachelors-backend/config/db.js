const mongoose = require('mongoose');
require('dotenv').config();  // If you're using environment variables for DB connection

// Example: MongoDB connection URL from environment variables
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/bachelors'; // Change this to your DB URI

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error: ', err);
  });

module.exports = mongoose;

