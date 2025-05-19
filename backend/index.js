const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (optional, as dev.nix sets env)
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());

// Import user routes
const userRoutes = require('./routes/userRoutes');

// Mount user routes
app.use('/api/users', userRoutes);

// Debug: Log environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***hidden***' : 'undefined');

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Basic route 
app.get('/', (req, res) => {
  res.send('SkillSwap Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle Mongoose connection errors
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});