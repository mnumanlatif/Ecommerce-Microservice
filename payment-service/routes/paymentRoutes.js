const express = require('express');
const router = express.Router();

const { processPaymentController, initiatePayment, handleCallback } = require('../controllers/paymentController');  // check this path
const verifyToken = require('../../auth-service/middleware/verifyToken');


// Must be a function, not undefined
router.post('/pay', verifyToken, processPaymentController);

router.post('/onlinepay', initiatePayment); // method: 'jazzcash' or 'easypaisa' in body
router.post('/callback', handleCallback); // Common callback (optional to split later)

module.exports = router;
