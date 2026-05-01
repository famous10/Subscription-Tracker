var User = require('../models/user.model');

// ─── Get All Users ────────────────────────────────────────────────────────────
var getUsers = async (req, res, next) => {
  try {
    var users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get User By ID ───────────────────────────────────────────────────────────
var getUser = async (req, res, next) => {
  try {
    var user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create User ──────────────────────────────────────────────────────────────
var createUser = async (req, res, next) => {
  try {
    var { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    var existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    var bcryptjs = require('bcryptjs');
    var hashedPassword = await bcryptjs.hash(password, 10);

    var newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update User ──────────────────────────────────────────────────────────────
var updateUser = async (req, res, next) => {
  try {
    var user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────
var deleteUser = async (req, res, next) => {
  try {
    var user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
