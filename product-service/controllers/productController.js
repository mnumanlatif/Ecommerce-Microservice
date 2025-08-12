const e = require('cors');
const asyncHandler = require('../../shared/middleware/asyncHandler');
const productService = require('../services/productService');

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await productService.getProductById(productId);
  res.json(product);
});

exports.editProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = await productService.editProduct(productId, req.body);
  res.json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  await productService.deleteProduct(productId);
  res.status(204).send();
});

exports.createProduct = asyncHandler(async (req, res) => {
  const newProduct = await productService.createProduct(req.body);
  res.status(201).json(newProduct);
});
