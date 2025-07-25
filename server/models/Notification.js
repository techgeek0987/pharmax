const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'urgent'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['order', 'driver', 'vehicle', 'system', 'inventory', 'customer'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  recipients: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    readAt: Date,
    actionTaken: {
      type: Boolean,
      default: false
    }
  }],
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Order', 'Driver', 'Vehicle', 'Product', 'Invoice']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  actions: [{
    label: String,
    action: String,
    url: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET'
    }
  }],
  metadata: {
    source: String,
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    automatedRule: String,
    tags: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'read', 'dismissed', 'expired'],
    default: 'pending'
  },
  scheduledFor: Date,
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
notificationSchema.index({ 'recipients.userId': 1, status: 1, createdAt: -1 });
notificationSchema.index({ category: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);