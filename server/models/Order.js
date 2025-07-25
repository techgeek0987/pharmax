const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  batchId: {
    type: String,
    index: true
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  deliveryWindow: {
    start: Date,
    end: Date
  },
  customer: {
    id: String,
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  location: {
    type: String,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  time: {
    type: String
  },
  scheduledDelivery: {
    date: Date,
    timeSlot: String,
    instructions: String
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: String,
    sku: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  packages: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['EXPRESS', 'REFRIGERATED', 'HEAVY', 'LATE PICKUP', 'STANDARD', 'URGENT']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignee: {
    type: String
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  status: {
    type: String,
    required: true,
    enum: ['to-be-fulfilled', 'open', 'ready', 'assigned', 'in-transit', 'delivered', 'completed', 'cancelled', 'returned']
  },
  secondType: {
    type: String,
    enum: ['EXPRESS', 'REFRIGERATED', 'HEAVY', 'LATE PICKUP', 'STANDARD', 'URGENT']
  },
  image: {
    type: String
  },
  duration: {
    type: String
  },
  estimatedDuration: {
    type: Number // in minutes
  },
  actualDuration: {
    type: Number // in minutes
  },
  assignShelf: {
    type: Boolean,
    default: false
  },
  weight: {
    type: String
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  code: {
    type: String
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  prescription: {
    required: Boolean,
    prescriptionId: String,
    doctorName: String,
    patientName: String
  },
  specialInstructions: {
    type: String
  },
  deliveryNotes: {
    type: String
  },
  totalAmount: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  relatedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-generate order number if not provided
  if (!this.orderNumber) {
    this.orderNumber = this.id;
  }
  
  // Auto-generate tracking number for orders that are ready or beyond
  if (['ready', 'assigned', 'in-transit', 'delivered'].includes(this.status) && !this.trackingNumber) {
    this.trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.modifiedBy || null
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);