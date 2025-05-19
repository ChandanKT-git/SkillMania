const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());

// Debug: Log MONGO_URI to verify it's loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('SkillSwap Backend is running!');
});

// Use user routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Mongoose connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});