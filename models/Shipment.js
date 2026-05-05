// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
const mongoose = require('mongoose')

// SMELL: [MEDIUM] Magic string for default status value. Should be a constant or enum.
const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending' // pending, in-progress, delivered, cancelled
  },
  weight: {
    type: Number,
    required: true
  },
  carrier: {
    type: String,
    required: true
  },
  // which user this shipment belongs to
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// hook for pre-save on model
shipmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Shipment', shipmentSchema)

module.exports = mongoose.model('Shipment', shipmentSchema);
