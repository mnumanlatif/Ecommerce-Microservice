const Product = require('../models/Product');
const { AppError } = require('../../shared/middleware/errorHandler');

const getAllProducts = async () => {
  return await Product.find();
};

const createProduct = async (productData) => {
  const { title, description, price, imageUrl } = productData;

  if (!title || !description || !price || !imageUrl) {
    throw new AppError('All fields (title, description, price, imageUrl) are required', 400);
  }

  return await Product.create(productData);
};

module.exports = {
  getAllProducts,
  createProduct,
};
