const Product = require('../models/Product');
const { AppError } = require('../../shared/middleware/errorHandler');
const asyncHandler = require('../../shared/middleware/asyncHandler');

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

const editProduct = async (productId, productData) => {
  const { title, description, price, imageUrl } = productData;
  if (!title || !description || !price || !imageUrl) {
    throw new AppError('All fields (title, description, price, imageUrl) are required', 400);
  }
  const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
  if (!updatedProduct) {
    throw new AppError('Product not found', 404);
  }
  return updatedProduct;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const deleteProduct = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new AppError('Product not found', 404);
  }
  return deletedProduct;
};

module.exports = {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProductById,
  editProduct,
};
