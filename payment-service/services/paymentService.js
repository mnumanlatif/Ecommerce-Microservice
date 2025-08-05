const Payment = require('../models/Payment');
const paymentProducer = require('../events/paymentProducer');
const { AppError } = require('../../shared/middleware/errorHandler');

/**
 * Process a payment for an order.
 * @param {Object} order - Order details from frontend
 * @param {ObjectId} userId - Authenticated user ID
 * @returns {Object} - Payment result
 */
const processOrderPayment = async (order, userId) => {
 if (
  !order || 
  !userId ||
  !Array.isArray(order.items) ||
  order.items.length === 0 ||
  !order.shippingDetails ||
  !order.paymentMethod
) {
  throw new AppError('Invalid order data for payment processing', 400);
}


  const totalAmount = order.total ?? calculateTotal(order.items);

  const orderItems = order.items.map(item => ({
    productId: item.productId || item._id || item.id,
    quantity: item.quantity ?? 1,
    price: item.price ?? 10,
  }));

  // Simulate payment success/failure (for now we assume success)
  const isPaymentSuccessful = true;

  const payment = new Payment({
    userId,
    orderItems,
    amount: totalAmount,
    status: isPaymentSuccessful ? 'success' : 'failed',
    shippingDetails: order.shippingDetails,
    paymentMethod: order.paymentMethod,
  });

  await payment.save();

  const kafkaPayload = {
    paymentId: payment._id,
    userId: payment.userId,
    orderId: payment._id,
    amount: totalAmount,
    status: payment.status,
  };

  try {
    if (isPaymentSuccessful) {
      console.log(`✅ Payment successful for user ${payment.userId}`);
      await paymentProducer.sendPaymentSuccessful(kafkaPayload);
    } else {
      console.log(`❌ Payment failed for user ${payment.userId}`);
      await paymentProducer.sendPaymentFailed(kafkaPayload);
    }
  } catch (err) {
    console.error('⚠️ Kafka event error:', err);
  }

  return {
    message: isPaymentSuccessful ? 'Payment successful' : 'Payment failed',
    success: isPaymentSuccessful,
    payment,
  };
};

// Helper to calculate total if not sent from frontend
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.price ?? 10;
    const quantity = item.quantity ?? 1;
    return total + price * quantity;
  }, 0);
};

module.exports = {
  processOrderPayment,
};
