const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { AppError } = require('../../shared/middleware/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

// Register new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 400);
  }

  const payload = { id: user._id, name: user.name, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// console.log('Generated access token:', token);
  // ✅ Set token in HTTP-only cookie
  res.cookie('accessToken', token, {
    httpOnly: true,
    sameSite: 'Lax', // Use 'None' with secure: true in production over HTTPS
    secure: false,   // Set to true in production
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({ message: 'Login successful', user: payload, token });  // include token here
});
// Logout user
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, // Set to true in production
  });

  res.json({ message: 'Logout successful' });
});

// Get current logged-in user
const currentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});


module.exports = {
  register,
  login,
  logout,
  currentUser,
};
