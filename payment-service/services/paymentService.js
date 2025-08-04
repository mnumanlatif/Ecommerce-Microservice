const Payment = require('../models/Payment');
const paymentProducer = require('../events/paymentProducer');
const { AppError } = require('../../shared/middleware/errorHandler');

const processOrderPayment = async (order) => {
  if (!order || !order.userId || !Array.isArray(order.items) || order.items.length === 0) {
    throw new AppError('Invalid order data for payment processing', 400);
  }

  const totalAmount = order.totalAmount ?? calculateTotal(order.items);
  const isPaymentSuccessful = Math.random() < 0.8;

  const orderItems = order.items.map(item => ({
    productId: item.productId || item._id || item.id,
    quantity: item.quantity ?? 1,
  }));

  const payment = new Payment({
    userId: order.userId,
    orderItems,
    status: isPaymentSuccessful ? 'success' : 'failed',
    amount: totalAmount,
  });

  await payment.save();

  const kafkaPayload = {
    paymentId: payment._id,
    userId: payment.userId,
    orderId: payment._id,
    amount: totalAmount,
    status: payment.status,
  };

  if (isPaymentSuccessful) {
    console.log(`✅ Payment successful for user ${payment.userId}`);
    await paymentProducer.sendPaymentSuccessful(kafkaPayload);
  } else {
    console.log(`❌ Payment failed for user ${payment.userId}`);
    await paymentProducer.sendPaymentFailed(kafkaPayload);
  }

  return {
    message: isPaymentSuccessful ? 'Payment successful' : 'Payment failed',
    success: isPaymentSuccessful,
    payment,
  };
};

// Helper to calculate total
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
