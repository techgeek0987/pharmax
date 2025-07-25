const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  price: {
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    selling: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minStock: {
      type: Number,
      default: 10
    },
    maxStock: {
      type: Number,
      default: 1000
    },
    reorderPoint: {
      type: Number,
      default: 20
    },
    location: {
      warehouse: String,
      shelf: String,
      bin: String
    }
  },
  specifications: {
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['g', 'kg', 'lb', 'oz'],
        default: 'kg'
      }
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'm', 'in', 'ft'],
        default: 'cm'
      }
    },
    color: String,
    size: String,
    material: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'out-of-stock'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
  }],
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  regulatoryInfo: {
    fdaApproved: {
      type: Boolean,
      default: false
    },
    controlledSubstance: {
      type: Boolean,
      default: false
    },
    schedule: {
      type: String,
      enum: ['I', 'II', 'III', 'IV', 'V']
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-update status based on inventory
  if (this.inventory.quantity <= 0) {
    this.status = 'out-of-stock';
  } else if (this.status === 'out-of-stock' && this.inventory.quantity > 0) {
    this.status = 'active';
  }
  
  next();
});

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.price.cost > 0) {
    return ((this.price.selling - this.price.cost) / this.price.cost * 100).toFixed(2);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.inventory.quantity <= 0) return 'out-of-stock';
  if (this.inventory.quantity <= this.inventory.reorderPoint) return 'low-stock';
  if (this.inventory.quantity >= this.inventory.maxStock) return 'overstock';
  return 'in-stock';
});

// Indexes for better query performance
productSchema.index({ sku: 1 });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'inventory.quantity': 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);