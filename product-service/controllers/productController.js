const asyncHandler = require('../../shared/middleware/asyncHandler');
const productService = require('../services/productService');

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  res.status(201).json(newProduct);
});
