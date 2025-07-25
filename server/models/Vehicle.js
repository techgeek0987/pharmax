const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  maxWeight: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: String
  },
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);