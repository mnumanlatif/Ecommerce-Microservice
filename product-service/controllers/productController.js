const Product = require('../models/Product');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { AppError } = require('../../shared/middleware/errorHandler');

// GET /products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// POST /products
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, imageUrl } = req.body;

  if (!title || !price || !description || !imageUrl) {
    throw new AppError('All fields are required', 400);
  }

  const newProduct = await Product.create({ title, description, price, imageUrl });
  res.status(201).json(newProduct);
});

module.exports = { getAllProducts, createProduct };
