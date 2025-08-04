const asyncHandler = require('../../shared/middleware/asyncHandler');
const { registerUser, loginUser, getCurrentUser } = require('../services/authService');

// Register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  await registerUser(name, email, password, role);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, payload } = await loginUser(email, password);

  res.cookie('accessToken', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false, // Set true in production
    maxAge: 60 * 60 * 1000,
  });

  res.json({ message: 'Login successful', user: payload, token });
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });

  res.json({ message: 'Logout successful' });
});

// Get current user
const currentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  res.json(user);
});

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
