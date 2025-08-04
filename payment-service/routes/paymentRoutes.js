const express = require('express');
const router = express.Router();
const verifyToken = require('../../auth-service/middleware/verifyToken');
const { processPayment } = require('../controllers/paymentController');

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const order = { ...req.body, userId: req.user.id };  // attach userId from token
    const result = await processPayment(order);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error('Payment route error:', err);
    next(err);
  }
});

module.exports = router;
