const { processOrderPayment } = require('../services/paymentService');
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

module.exports = {
  processPaymentController,
};
