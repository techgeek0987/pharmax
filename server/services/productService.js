const BaseService = require('./BaseService');
const Product = require('../models/Product');

class ProductService extends BaseService {
  constructor() {
    const populateOptions = [];
    
    super(Product, 'Product', populateOptions);
  }

  // Custom search with product-specific fields
  async searchProducts(searchTerm, queryString = {}) {
    const searchableFields = [
      'name',
      'sku',
      'description',
      'category',
      'subcategory',
      'manufacturer',
      'tags'
    ];
    
    const modifiedQuery = { ...queryString, search: searchTerm };
    return await this.search(modifiedQuery, searchableFields);
  }

  // Get product by SKU
  async getBySku(sku) {
    try {
      return await this.getByField('sku', sku);
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  async getByCategory(category, subcategory = null, queryString = {}) {
    try {
      const filter = { category };
      if (subcategory) {
        filter.subcategory = subcategory;
      }

      const modifiedQuery = { ...queryString, ...filter };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Update inventory
  async updateInventory(productId, quantity, operation = 'set') {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let newQuantity;
      switch (operation) {
        case 'add':
          newQuantity = product.inventory.quantity + quantity;
          break;
        case 'subtract':
          newQuantity = product.inventory.quantity - quantity;
          if (newQuantity < 0) {
            throw new Error('Insufficient inventory');
          }
          break;
        case 'set':
        default:
          newQuantity = quantity;
          break;
      }

      const updatedProduct = await this.update(productId, {
        'inventory.quantity': newQuantity,
        'inventory.lastUpdated': new Date()
      });

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Get low stock products
  async getLowStockProducts(queryString = {}) {
    try {
      const products = await this.model.find({
        $expr: {
          $lte: ['$inventory.quantity', '$inventory.lowStockThreshold']
        }
      }).populate(this.populateOptions);

      return {
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get out of stock products
  async getOutOfStockProducts(queryString = {}) {
    try {
      const products = await this.model.find({
        'inventory.quantity': 0
      }).populate(this.populateOptions);

      return {
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get products expiring soon
  async getExpiringSoonProducts(days = 30, queryString = {}) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const products = await this.model.find({
        expiryDate: {
          $exists: true,
          $lte: expiryDate,
          $gte: new Date()
        }
      }).populate(this.populateOptions).sort('expiryDate');

      return {
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get products with custom filters
  async getWithFilters(filters) {
    try {
      const query = {};

      // Apply filters
      if (filters.category) query.category = filters.category;
      if (filters.subcategory) query.subcategory = filters.subcategory;
      if (filters.manufacturer) query.manufacturer = filters.manufacturer;
      if (filters.inStock) query['inventory.quantity'] = { $gt: 0 };
      
      // Price range
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
      }

      // Tags
      if (filters.tags) {
        query.tags = { $in: filters.tags.split(',') };
      }

      const products = await this.model.find(query)
        .populate(this.populateOptions)
        .sort('-createdAt');

      return {
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Bulk update prices
  async bulkUpdatePrices(updates) {
    try {
      const results = [];

      for (const update of updates) {
        try {
          const product = await this.update(update.productId, {
            price: update.newPrice,
            'pricing.lastUpdated': new Date()
          });
          
          if (product) {
            results.push({
              productId: update.productId,
              success: true,
              product
            });
          } else {
            results.push({
              productId: update.productId,
              success: false,
              error: 'Product not found'
            });
          }
        } catch (error) {
          results.push({
            productId: update.productId,
            success: false,
            error: error.message
          });
        }
      }

      return {
        totalUpdates: updates.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      };
    } catch (error) {
      throw error;
    }
  }

  // Get top selling products
  async getTopSellingProducts(limit = 10, queryString = {}) {
    try {
      // This would typically require order data to calculate sales
      // For now, we'll sort by a sales field if it exists
      const products = await this.model.find({})
        .populate(this.populateOptions)
        .sort('-salesCount -createdAt')
        .limit(limit);

      return {
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get product statistics
  async getProductStats() {
    try {
      const total = await this.count();
      
      const categoryStats = await this.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const inventoryStats = await this.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalInventory: { $sum: '$inventory.quantity' },
            avgPrice: { $avg: '$price' },
            lowStockCount: {
              $sum: {
                $cond: [
                  { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] },
                  1,
                  0
                ]
              }
            },
            outOfStockCount: {
              $sum: {
                $cond: [{ $eq: ['$inventory.quantity', 0] }, 1, 0]
              }
            }
          }
        }
      ]);

      // Price distribution
      const priceRanges = await this.aggregate([
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 10, 50, 100, 500, 1000, Infinity],
            default: 'Other',
            output: {
              count: { $sum: 1 },
              avgPrice: { $avg: '$price' }
            }
          }
        }
      ]);

      // Expiring products count
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringCount = await this.count({
        expiryDate: {
          $exists: true,
          $lte: thirtyDaysFromNow,
          $gte: new Date()
        }
      });

      return {
        totalProducts: total,
        categoryStats,
        inventory: inventoryStats[0] || {
          totalProducts: 0,
          totalInventory: 0,
          avgPrice: 0,
          lowStockCount: 0,
          outOfStockCount: 0
        },
        priceRanges,
        expiringCount
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate product data
  async validateProductData(data, isUpdate = false, productId = null) {
    try {
      const errors = [];

      // Required fields for creation
      if (!isUpdate) {
        if (!data.name) errors.push('Product name is required');
        if (!data.sku) errors.push('SKU is required');
        if (!data.price) errors.push('Price is required');
      }

      // Check for duplicate SKU
      if (data.sku) {
        const skuFilter = { sku: data.sku };
        if (isUpdate && productId) {
          skuFilter._id = { $ne: productId };
        }
        const skuExists = await this.exists(skuFilter);
        if (skuExists) {
          errors.push('SKU already exists');
        }
      }

      // Validate price
      if (data.price && (isNaN(data.price) || data.price < 0)) {
        errors.push('Price must be a positive number');
      }

      // Validate inventory quantity
      if (data.inventory && data.inventory.quantity && data.inventory.quantity < 0) {
        errors.push('Inventory quantity cannot be negative');
      }

      // Validate expiry date
      if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
        errors.push('Expiry date cannot be in the past');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;