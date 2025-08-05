const express = require('express');
const router = express.Router();

const { processPaymentController } = require('../controllers/paymentController');  // check this path
const verifyToken = require('../../auth-service/middleware/verifyToken');

// Must be a function, not undefined
router.post('/pay', verifyToken, processPaymentController);

module.exports = router;
