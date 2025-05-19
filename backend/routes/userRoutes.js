const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is authorized to view this profile
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { username, email } = req.body;

  // Basic validation
  if (!username && !email) {
    return res.status(400).json({ msg: 'Please provide username or email to update' });
  }

  const userFields = {};
  if (username) userFields.username = username;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is authorized to update this profile
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    // Check for duplicate email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // Check for duplicate username
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ msg: 'Username already in use' });
      }
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is authorized to delete this profile
    if (user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Mount auth routes
router.use('/auth', require('./authRoutes'));

module.exports = router;