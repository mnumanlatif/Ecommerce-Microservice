const Cart = require('../models/Cart');
const kafkaProducer = require('../kafka/cartProducer');
const { AppError } = require('../../shared/middleware/errorHandler');

// Helper to sanitize items
const sanitizeItems = (items) => {
  return items
    .map(({ productId, name, price, imageUrl, quantity }) => {
      if (!productId || !name || price == null) return null;
      quantity = Number(quantity);
      if (isNaN(quantity) || quantity < 1) quantity = 1;
      return { productId, name, price, imageUrl, quantity };
    })
    .filter(Boolean);
};

const addItemsToCart = async (userId, items) => {
  if (!userId || !Array.isArray(items) || items.length === 0) {
    throw new AppError('Invalid cart data', 400);
  }

  const validItems = sanitizeItems(items);
  if (validItems.length === 0) throw new AppError('No valid items to add', 400);

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: validItems });
  } else {
    validItems.forEach(({ productId, name, price, imageUrl, quantity }) => {
      const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + quantity;
      } else {
        cart.items.push({ productId, name, price, imageUrl, quantity });
      }
    });
  }

  return await cart.save();
};

const getCartByUserId = async (userId) => {
  if (!userId) throw new AppError('Missing userId', 400);

  let cart = await Cart.findOne({ userId });

  // If no cart exists, return empty cart object
  if (!cart) {
    return {
      userId,
      items: [],
      total: 0,
    };
  }

  return cart;
};


const removeItemFromCart = async (userId, productId) => {
  if (!userId || !productId) throw new AppError('Missing required fields', 400);
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
  return await cart.save();
};

const checkoutCart = async (userId) => {
  if (!userId) throw new AppError('Missing userId', 400);
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) throw new AppError('Cart is empty or not found', 400);

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

  return orderPayload;
};

const clearCartByUserId = async (userId) => {
  // Delete all cart items for the given userId
  return Cart.deleteMany({ userId });
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new AppError(`Cart not found for userId: ${userId}`, 404);

  const item = cart.items.find(item => item.productId.toString() === productId);
  if (!item) throw new AppError(`Item ${productId} not found in cart`, 404);

  item.quantity = quantity;
  await cart.save();

  return cart.items;
};



module.exports = {
  addItemsToCart,
  getCartByUserId,
  removeItemFromCart,
  checkoutCart,
  clearCartByUserId,
  updateCartItemQuantity,

};
