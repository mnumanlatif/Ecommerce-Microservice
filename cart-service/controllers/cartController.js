const Cart = require('../models/Cart');
const kafkaProducer = require('../kafka/cartProducer');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid cart data' });
    }

    // Ensure quantity is a valid number and default to 1 if invalid
    let { productId, name, price, imageUrl, quantity } = items[0];
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 1) quantity = 1;

    // Debug log incoming data
    console.log('AddToCart Request:', { userId, productId, name, price, imageUrl, quantity });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, name, price, imageUrl, quantity }],
      });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);

      if (existingItem) {
        // Ensure existing quantity is number
        existingItem.quantity = (existingItem.quantity || 0) + quantity;
      } else {
        cart.items.push({ productId, name, price, imageUrl, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({ status: 'success', message: 'Item added to cart', cart });

  } catch (err) {
    console.error('❌ Error in addToCart:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).json({ message: 'Item removed from cart', cart });

  } catch (err) {
    console.error('❌ Error in removeFromCart:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Checkout
exports.checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: 'Missing userId' });

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      userId,
      items: cart.items,
      totalAmount,
      createdAt: new Date(),
    };

    await kafkaProducer.sendOrderCreated(orderPayload);

    cart.items = [];
    await cart.save();

    return res.status(200).json({ message: 'Checkout successful', order: orderPayload });

  } catch (err) {
    console.error('❌ Error in checkout:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
