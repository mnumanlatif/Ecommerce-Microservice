const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct,
} = require('../controllers/productController');

// GET /api/products - get all products
router.get('/', getAllProducts);

// GET /api/products/:id - get single product by id
router.get('/:id', getProductById);

// POST /api/products - create a new product
router.post('/', createProduct);

// PUT /api/products/:id - update a product by id
router.put('/:id', editProduct);

// DELETE /api/products/:id - delete a product by id
router.delete('/:id', deleteProduct);

module.exports = router;
