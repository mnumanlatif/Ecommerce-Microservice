const asyncHandler = require('../../shared/middleware/asyncHandler');
const cartService = require('../services/cartService');

// Add items to cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;
  const cart = await cartService.addItemsToCart(userId, items);
  res.status(200).json({ status: 'success', message: 'Item(s) added to cart', cart });
});

// Get cart by user
const getCartByUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const cart = await cartService.getCartByUserId(userId);
  res.status(200).json(cart);
});

// Remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;
  const cart = await cartService.removeItemFromCart(userId, productId);
  res.status(200).json({ message: 'Item removed from cart', cart });
});

// Checkout
const checkout = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const order = await cartService.checkoutCart(userId);
  res.status(200).json({ message: 'Checkout successful', order });
});

module.exports = {
  addToCart,
  getCartByUser,
  removeFromCart,
  checkout,
};
