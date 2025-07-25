const BaseController = require('./BaseController');
const ProductService = require('../services/ProductService');

const productService = new ProductService();
const baseController = new BaseController(productService);

// Get all products with filtering, searching, sorting, and pagination
exports.getAllProducts = baseController.getAll.bind(baseController);

// Get single product by ID
exports.getProductById = baseController.getById.bind(baseController);

// Create new product
exports.createProduct = baseController.create.bind(baseController);

// Update product
exports.updateProduct = baseController.update.bind(baseController);

// Delete product
exports.deleteProduct = baseController.delete.bind(baseController);

// Get product statistics
exports.getProductStats = baseController.getStats.bind(baseController);

// Custom product-specific endpoints
exports.getProductBySku = async (req, res) => {
  try {
    const product = await productService.getBySku(req.params.sku);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Error getting product by SKU:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message
    });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    const product = await productService.updateInventory(req.params.id, quantity, operation);

    res.status(200).json({
      success: true,
      message: 'Inventory updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory',
      error: error.message
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { subcategory } = req.query;
    const result = await productService.getByCategory(req.params.category, subcategory, req.query);

    res.status(200).json({
      success: true,
      message: `Products in category '${req.params.category}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products by category',
      error: error.message
    });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await productService.getLowStockProducts(req.query);

    res.status(200).json({
      success: true,
      message: 'Low stock products retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting low stock products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving low stock products',
      error: error.message
    });
  }
};

exports.getOutOfStockProducts = async (req, res) => {
  try {
    const result = await productService.getOutOfStockProducts(req.query);

    res.status(200).json({
      success: true,
      message: 'Out of stock products retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting out of stock products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving out of stock products',
      error: error.message
    });
  }
};

exports.getExpiringSoonProducts = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const result = await productService.getExpiringSoonProducts(days, req.query);

    res.status(200).json({
      success: true,
      message: `Products expiring in ${days} days retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting expiring products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving expiring products',
      error: error.message
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const result = await productService.searchProducts(q, req.query);

    res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

exports.getProductsWithFilters = async (req, res) => {
  try {
    const result = await productService.getWithFilters(req.query);

    res.status(200).json({
      success: true,
      message: 'Filtered products retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting filtered products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving filtered products',
      error: error.message
    });
  }
};

exports.bulkUpdatePrices = async (req, res) => {
  try {
    const result = await productService.bulkUpdatePrices(req.body.updates);

    res.status(200).json({
      success: true,
      message: 'Prices updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error bulk updating prices:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating prices',
      error: error.message
    });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const result = await productService.getTopSellingProducts(limit, req.query);

    res.status(200).json({
      success: true,
      message: 'Top selling products retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting top selling products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving top selling products',
      error: error.message
    });
  }
};