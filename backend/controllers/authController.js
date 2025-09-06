const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    if (!validator.isEmail(email)) {
      const error = new Error('Please provide a valid email');
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 409;
      throw error;
    }

    // Create user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isPasswordValid = await user.correctPassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};