/**
 * Main routes index
 * Combines all route modules
 */

const express = require('express')
const router = express.Router()

const authRoutes = require('./auth.routes')
const shipmentRoutes = require('./shipment.routes')
const userRoutes = require('./user.routes')

// Route handlers
router.use('/auth', authRoutes)
router.use('/shipments', shipmentRoutes)
router.use('/users', userRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

module.exports = router
