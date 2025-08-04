const express = require('express');
const router = express.Router();
const { register, login, logout, currentUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current-user', verifyToken, currentUser);

module.exports = router;
