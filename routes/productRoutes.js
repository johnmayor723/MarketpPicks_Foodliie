const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { isAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.post('/', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;