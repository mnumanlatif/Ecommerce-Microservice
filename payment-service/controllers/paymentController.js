const asyncHandler = require('../../shared/middleware/asyncHandler');
const { processOrderPayment } = require('../services/paymentService');

const processPayment = asyncHandler(async (req, res) => {
  const order = req.body;
  const result = await processOrderPayment(order);

  res.status(result.success ? 200 : 400).json(result);
});

module.exports = {
  processPayment,
};
