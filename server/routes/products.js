const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/stats - Get product statistics
router.get('/stats', productController.getProductStats);

// GET /api/products/filter - Get products with filters
router.get('/filter', productController.getProductsWithFilters);

// GET /api/products/search - Search products
router.get('/search', productController.searchProducts);

// GET /api/products/low-stock - Get low stock products
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/products/out-of-stock - Get out of stock products
router.get('/out-of-stock', productController.getOutOfStockProducts);

// GET /api/products/expiring - Get expiring products
router.get('/expiring', productController.getExpiringSoonProducts);

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// GET /api/products/sku/:sku - Get product by SKU
router.get('/sku/:sku', productController.getProductBySku);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProductById);

// POST /api/products - Create new product
router.post('/', productController.createProduct);

// POST /api/products/bulk-update-prices - Bulk update prices
router.post('/bulk-update-prices', productController.bulkUpdatePrices);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

// PATCH /api/products/:id/inventory - Update product inventory
router.patch('/:id/inventory', productController.updateInventory);

module.exports = router;