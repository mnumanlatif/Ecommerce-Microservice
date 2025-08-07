const Payment = require('../models/Payment');
const paymentProducer = require('../events/paymentProducer');
const { AppError } = require('../../shared/middleware/errorHandler');
const generateHash = require('../utils/generateHash');

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

const handleJazzCashPayment = (amount, email) => {
  const dateTime = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const txnRef = `JC-${dateTime}`;

  const payload = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
    pp_Password: process.env.JAZZCASH_PASSWORD,
    pp_TxnRefNo: txnRef,
    pp_Amount: amount * 100,
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: dateTime,
    pp_BillReference: 'billRef-Jazz',
    pp_Description: 'JazzCash Payment',
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL,
  };

  payload.pp_SecureHash = generateHash(payload, process.env.JAZZCASH_INTEGRITY_SALT);

  return {
    postUrl: process.env.JAZZCASH_POST_URL,
    fields: payload,
  };
};

const handleEasyPaisaPayment = (amount, email) => {
  const dateTime = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const txnRef = `EP-${dateTime}`;

  const payload = {
    pp_Version: '1.1',
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_MerchantID: process.env.EASYPAISA_MERCHANT_ID,
    pp_Password: process.env.EASYPAISA_PASSWORD,
    pp_TxnRefNo: txnRef,
    pp_Amount: amount * 100,
    pp_TxnCurrency: 'PKR',
    pp_TxnDateTime: dateTime,
    pp_BillReference: 'billRef-EasyPaisa',
    pp_Description: 'EasyPaisa Payment',
    pp_ReturnURL: process.env.EASYPAISA_RETURN_URL,
  };

  payload.pp_SecureHash = generateHash(payload, process.env.EASYPAISA_INTEGRITY_SALT);

  return {
    postUrl: process.env.EASYPAISA_POST_URL,
    fields: payload,
  };
};

module.exports = {
  processOrderPayment,
  handleEasyPaisaPayment,
  handleJazzCashPayment,
};
