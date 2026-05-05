/**
 * User routes
 * All routes require authentication
 * GET /api/users/profile - Get current user profile
 */

const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { authenticateToken } = require('../middlewares/auth.middleware')

// All user routes require authentication
router.use(authenticateToken)

router.get('/profile', userController.getProfile)

module.exports = router
