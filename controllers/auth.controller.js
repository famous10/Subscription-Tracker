var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user.model');
var { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

// ─── Sign Up ──────────────────────────────────────────────────────────────────
var signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    var { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    // Check if user already exists
    var existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    var hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user within session
    var newUser = await User.create([{ name, email, password: hashedPassword }], { session });

    // Generate JWT token
    var token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: {
          id: newUser[0]._id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ─── Sign In ──────────────────────────────────────────────────────────────────
var signIn = async (req, res, next) => {
  try {
    var { email, password } = req.body;

    // Check if user exists
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check password
    var isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    var token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Sign Out ─────────────────────────────────────────────────────────────────
var signOut = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User signed out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn, signOut };
