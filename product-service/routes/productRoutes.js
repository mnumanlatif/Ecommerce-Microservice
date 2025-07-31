const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/productController');

// GET /api/product
router.get('/', getAllProducts);

// POST /api/product
router.post('/', createProduct);

module.exports = router;
