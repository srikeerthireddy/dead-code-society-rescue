/**
 * Shipment service
 * Handles all shipment-related business logic
 */

const Shipment = require('../../models/Shipment')
const {
  NotFoundError,
  ForbiddenError,
  ValidationError
} = require('../utils/errors.util')

const SHIPMENT_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled']

/**
 * Generate a unique tracking ID
 * @returns {string} Tracking ID in format SHIP-timestamp-random
 */
const generateTrackingId = () => {
  return `SHIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/**
 * Create a new shipment
 * @param {string} userId - ID of user creating shipment
 * @param {Object} shipmentData - Shipment data {origin, destination, weight, carrier}
 * @returns {Promise<Object>} Created shipment object
 * @throws {ValidationError} If data is invalid
 */
const createShipment = async (userId, shipmentData) => {
  const trackingId = generateTrackingId()

  const newShipment = new Shipment({
    ...shipmentData,
    trackingId,
    userId,
    status: 'pending'
  })

  const saved = await newShipment.save()
  return saved.toObject()
}

/**
 * Get all shipments for a user
 * Optimized with .populate() to avoid N+1 queries
 * @param {string} userId - ID of user
 * @returns {Promise<Array>} Array of shipment objects with user details
 */
const getShipmentsByUser = async (userId) => {
  const shipments = await Shipment.find({ userId }).populate('userId', 'name email')

  return shipments.map((s) => s.toObject())
}

/**
 * Get a single shipment by ID
 * @param {string} shipmentId - Shipment ID
 * @param {string} userId - ID of requesting user
 * @param {string} userRole - Role of requesting user
 * @returns {Promise<Object>} Shipment object
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user not authorized to view shipment
 */
const getShipmentById = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId).populate(
    'userId',
    'name email'
  )

  if (!shipment) {
    throw new NotFoundError('Shipment not found')
  }

  // Check authorization: user must own shipment or be admin
  if (shipment.userId._id.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('Not authorized to access this shipment')
  }

  return shipment.toObject()
}

/**
 * Update shipment status
 * Only admins can mark as 'delivered'
 * @param {string} shipmentId - Shipment ID to update
 * @param {string} newStatus - New status value
 * @param {string} userId - ID of requesting user
 * @param {string} userRole - Role of requesting user
 * @returns {Promise<Object>} Updated shipment object
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user not authorized
 * @throws {ValidationError} If status is invalid
 */
const updateShipmentStatus = async (
  shipmentId,
  newStatus,
  userId,
  userRole
) => {
  if (!SHIPMENT_STATUSES.includes(newStatus)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${SHIPMENT_STATUSES.join(', ')}`
    )
  }

  // Only admins can mark as delivered
  if (newStatus === 'delivered' && userRole !== 'admin') {
    throw new ForbiddenError(
      'Only admins can mark shipments as delivered'
    )
  }

  const updatedShipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    { status: newStatus },
    { new: true }
  ).populate('userId', 'name email')

  if (!updatedShipment) {
    throw new NotFoundError('Shipment not found')
  }

  return updatedShipment.toObject()
}

/**
 * Delete a shipment
 * Only owner or admin can delete
 * @param {string} shipmentId - Shipment ID to delete
 * @param {string} userId - ID of requesting user
 * @param {string} userRole - Role of requesting user
 * @returns {Promise<void>}
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user not authorized to delete
 */
const deleteShipment = async (shipmentId, userId, userRole) => {
  const shipment = await Shipment.findById(shipmentId)

  if (!shipment) {
    throw new NotFoundError('Shipment not found')
  }

  // Check authorization: user must own shipment or be admin
  if (shipment.userId.toString() !== userId && userRole !== 'admin') {
    throw new ForbiddenError('Not authorized to delete this shipment')
  }

  await Shipment.findByIdAndDelete(shipmentId)
}

module.exports = {
  createShipment,
  getShipmentsByUser,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment,
  generateTrackingId
}
