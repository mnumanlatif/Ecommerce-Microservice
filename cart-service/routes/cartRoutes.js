const express = require('express');
const router = express.Router();
const { addToCart, getCartByUser, removeFromCart, checkout, clearCart } = require('../controllers/cartController');

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/checkout', checkout);
router.get('/cart', getCartByUser);
router.post('/clear', clearCart);

module.exports = router;
