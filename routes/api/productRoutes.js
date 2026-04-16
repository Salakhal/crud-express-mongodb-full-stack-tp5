const express = require('express');
const router = express.Router();
const productService = require('../../services/productService');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res.json(result);
}));

router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await productService.getStats();
  res.json(stats);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json(product);
}));

router.post('/', asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(product);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ success: true });
}));

module.exports = router;