const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['order', 'driver', 'vehicle', 'revenue', 'performance', 'customer']
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  metrics: {
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 },
    driverEfficiency: { type: Number, default: 0 },
    vehicleUtilization: { type: Number, default: 0 },
    onTimeDeliveries: { type: Number, default: 0 },
    lateDeliveries: { type: Number, default: 0 }
  },
  breakdown: {
    byStatus: [{
      status: String,
      count: Number,
      percentage: Number
    }],
    byType: [{
      type: String,
      count: Number,
      percentage: Number
    }],
    byRegion: [{
      region: String,
      count: Number,
      revenue: Number
    }],
    byDriver: [{
      driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
      ordersCompleted: Number,
      averageRating: Number,
      totalRevenue: Number
    }]
  },
  trends: {
    growthRate: Number,
    seasonalityFactor: Number,
    forecastNext: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for efficient querying
analyticsSchema.index({ type: 1, date: 1, period: 1 });
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);