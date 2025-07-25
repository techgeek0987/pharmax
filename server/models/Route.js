const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
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
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  startLocation: {
    address: String,
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  endLocation: {
    address: String,
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimatedDuration: {
    type: Number // in minutes
  },
  actualDuration: {
    type: Number // in minutes
  },
  estimatedDistance: {
    type: Number // in kilometers
  },
  actualDistance: {
    type: Number // in kilometers
  },
  scheduledStartTime: {
    type: Date
  },
  scheduledEndTime: {
    type: Date
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  optimized: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  optimization: {
    algorithm: {
      type: String,
      enum: ['nearest-neighbor', 'genetic', 'ant-colony', 'simulated-annealing'],
      default: 'nearest-neighbor'
    },
    totalDistance: Number,
    estimatedDuration: Number,
    actualDuration: Number,
    fuelConsumption: Number,
    optimizationScore: Number
  },

  constraints: {
    maxDuration: Number,
    maxDistance: Number,
    vehicleCapacity: Number,
    timeWindows: [{
      start: Date,
      end: Date,
      location: String
    }],
    driverShift: {
      start: Date,
      end: Date
    }
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled', 'paused'],
    default: 'planned'
  },
  metrics: {
    onTimeDeliveries: { type: Number, default: 0 },
    lateDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    customerSatisfaction: Number,
    efficiency: Number
  },
  realTimeTracking: {
    currentLocation: {
      lat: Number,
      lng: Number,
      timestamp: Date
    },
    nextStop: {
      orderId: mongoose.Schema.Types.ObjectId,
      eta: Date,
      distance: Number
    },
    deviations: [{
      timestamp: Date,
      reason: String,
      impact: String
    }]
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

// Manual pagination will be handled in the controller

// Indexes for efficient querying
routeSchema.index({ assignedDriver: 1, status: 1, createdAt: -1 });
routeSchema.index({ assignedVehicle: 1, status: 1 });
routeSchema.index({ orders: 1 });
routeSchema.index({ routeId: 1 });
routeSchema.index({ priority: 1, status: 1 });

// Update waypoints structure to match controller expectations
routeSchema.add({
  waypoints: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    estimatedArrival: Date,
    actualArrival: Date,
    completed: {
      type: Boolean,
      default: false
    },
    notes: String
  }]
});

routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Route', routeSchema);