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
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Payment', paymentSchema);
