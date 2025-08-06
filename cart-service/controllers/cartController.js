const asyncHandler = require('../../shared/middleware/asyncHandler');
const cartService = require('../services/cartService');

// Add items to cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;
  const cart = await cartService.addItemsToCart(userId, items);
  res.status(200).json({ status: 'success', message: 'Item(s) added to cart', cart });
  console.log('📥 Received cart POST:', req.body);
});

// Get cart by user
const getCartByUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const cart = await cartService.getCartByUserId(userId);

  // If no cart found, respond with empty items array instead of 404 or null
  if (!cart) {
    return res.status(200).json({ items: [] });
  }

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

const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  // Call service to clear cart items for userId
  await cartService.clearCartByUserId(userId);

  res.status(200).json({ message: 'Cart cleared successfully' });
});
const updateCartItem = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const updatedCartItems = await cartService.updateCartItemQuantity(userId, productId, quantity);
  res.status(200).json({ status: 'success', items: updatedCartItems });
});


module.exports = {
  addToCart,
  getCartByUser,
  removeFromCart,
  checkout,
  clearCart,  
  updateCartItem,
};
