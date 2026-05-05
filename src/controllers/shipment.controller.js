/**
 * Shipment controller
 * Handles shipment-related HTTP requests
 */

const shipmentService = require('../services/shipment.service')

/**
 * Create a new shipment
 * POST /api/shipments
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const create = async (req, res, next) => {
  try {
    const { origin, destination, weight, carrier } = req.body
    const shipment = await shipmentService.createShipment(req.userId, {
      origin,
      destination,
      weight,
      carrier
    })

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get all shipments for the authenticated user
 * GET /api/shipments
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const getAll = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getShipmentsByUser(req.userId)

    res.status(200).json({
      success: true,
      message: 'Shipments retrieved successfully',
      count: shipments.length,
      data: shipments
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get a single shipment by ID
 * GET /api/shipments/:id
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const getById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.userId,
      req.userRole
    )

    res.status(200).json({
      success: true,
      message: 'Shipment retrieved successfully',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update shipment status
 * PATCH /api/shipments/:id/status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      status,
      req.userId,
      req.userRole
    )

    res.status(200).json({
      success: true,
      message: 'Shipment status updated successfully',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Delete a shipment
 * DELETE /api/shipments/:id
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const delete_ = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    )

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getAll, getById, updateStatus, delete_ }
