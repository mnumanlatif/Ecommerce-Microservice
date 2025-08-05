const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  orderItems: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Product' 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      price: {  // Add price per item here
        type: Number,
        required: true,
        min: 0
      },
    },
  ],
  status: { 
    type: String, 
    enum: ['success', 'failed'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  shippingDetails: {  // Add shipping details embedded document
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {   // Add payment method
    type: String,
    enum: ['card', 'cod'],
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
