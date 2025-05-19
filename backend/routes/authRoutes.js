const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Make sure to configure dotenv in your main server file (e.g., index.js)
// and ensure process.env.JWT_SECRET is available.
const jwtSecret = process.env.JWT_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID; // Make sure this is also configured

const client = new OAuth2Client(googleClientId);

// Define your authentication routes here

// @route   POST /api/auth/google
// @desc    Authenticate user with Google and get token
// @access  Public
router.post('/google', async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ msg: 'No Google ID token provided' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    console.log('Google auth successful, payload:', payload);

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate JWT
      const payload = { user: { id: user.id } };
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } else {
      // User does not exist, create new user
      user = new User({
        username: name || email, // Use name or email as username
        email,
        // For simplicity, set a placeholder password. In a real app,
        // you might flag this user as a Google auth user and not require a password.
        password: email + Date.now(), // Simple placeholder, hash if needed
      });
      await user.save();

      // Generate JWT for the new user
      const payload = { user: { id: user.id } };
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });
    }
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).send('Server Error'); // Or a more specific error like 401 or 400 depending on the error type
  }
});

module.exports = router;