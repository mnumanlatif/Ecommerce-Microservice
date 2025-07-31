const Payment = require('../models/Payment');
const paymentProducer = require('../events/paymentProducer');
const { AppError } = require('../../shared/middleware/errorHandler');

// Simulate payment processing
exports.processPayment = async (order) => {
  try {
    if (!order || !order.userId || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
      throw new AppError('Invalid order data for payment processing', 400);
    }

    // Fake random success/failure (80% success rate)
    const isSuccess = Math.random() < 0.8;

    const paymentRecord = new Payment({
      userId: order.userId,
      orderItems: order.items,
      status: isSuccess ? 'success' : 'failed',
      amount: calculateTotal(order.items),
      createdAt: new Date(),
    });

    await paymentRecord.save();

    if (isSuccess) {
      console.log(`✅ Payment successful for user ${order.userId}`);
      await paymentProducer.sendPaymentSuccessful({ paymentId: paymentRecord._id, userId: order.userId });
    } else {
      console.log(`❌ Payment failed for user ${order.userId}`);
      await paymentProducer.sendPaymentFailed({ paymentId: paymentRecord._id, userId: order.userId });
    }

    return paymentRecord; // Optionally return for further use
  } catch (err) {
    // Log and rethrow for middleware or service to catch
    console.error('🔥 Payment processing error:', err);
    throw err.isOperational ? err : new AppError('Internal server error during payment', 500);
  }
};

// Simple total calculation
function calculateTotal(items) {
  // For demo, assume each product price = 10 units * quantity
  return items.reduce((sum, item) => sum + (10 * item.quantity), 0);
}
