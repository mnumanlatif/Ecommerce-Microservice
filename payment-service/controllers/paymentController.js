const { processOrderPayment, handleEasyPaisaPayment, handleJazzCashPayment } = require('../services/paymentService');
const { AppError } = require('../../shared/middleware/errorHandler');

const processPaymentController = async (req, res, next) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);  

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const order = req.body;

    const result = await processOrderPayment(order, userId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const initiatePayment = (req, res) => {
  const { method, amount, email } = req.body;

  if (!method || !amount || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let result;

    switch (method) {
      case 'jazzcash':
        result = handleJazzCashPayment(amount, email);
        break;
      case 'easypaisa':
        result = handleEasyPaisaPayment(amount, email);
        break;
      default:
        return res.status(400).json({ message: 'Unsupported payment method' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Payment Error:', error);
    return res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

 const handleCallback = (req, res) => {
  console.log('Payment Gateway Callback:', req.body);
  res.send('Payment callback received.');
};

module.exports = {
  processPaymentController,
  initiatePayment,
  handleCallback,
};