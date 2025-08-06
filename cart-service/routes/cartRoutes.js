const express = require('express');
const router = express.Router();
const { addToCart, getCartByUser, removeFromCart, checkout, clearCart, updateCartItem } = require('../controllers/cartController');

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/checkout', checkout);
router.get('/cart', getCartByUser);
router.post('/clear', clearCart);
router.put('/update', updateCartItem);


module.exports = router;
