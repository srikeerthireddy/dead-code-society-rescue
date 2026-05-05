/**
 * Shipment routes
 * All routes require authentication
 * GET /api/shipments - Get user's shipments
 * GET /api/shipments/:id - Get a specific shipment
 * POST /api/shipments - Create a new shipment
 * PATCH /api/shipments/:id/status - Update shipment status
 * DELETE /api/shipments/:id - Delete a shipment
 */

const express = require('express')
const router = express.Router()
const shipmentController = require('../controllers/shipment.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')
const { validateRequest } = require('../middlewares/validation.middleware')
const {
  createShipmentSchema,
  updateStatusSchema
} = require('../validators/shipment.validator')

// All shipment routes require authentication
router.use(authenticateToken)

router.post('/', validateRequest(createShipmentSchema), shipmentController.create)
router.get('/', shipmentController.getAll)
router.get('/:id', shipmentController.getById)
router.patch('/:id/status', validateRequest(updateStatusSchema), shipmentController.updateStatus)
router.delete('/:id', shipmentController.delete_)

module.exports = router
