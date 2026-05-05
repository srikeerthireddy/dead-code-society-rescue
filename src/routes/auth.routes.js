/**
 * Authentication routes
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login - Login user and get JWT token
 */

const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { validateRequest } = require('../middlewares/validation.middleware')
const { registerSchema, loginSchema } = require('../validators/auth.validator')

router.post('/register', validateRequest(registerSchema), authController.register)
router.post('/login', validateRequest(loginSchema), authController.login)

module.exports = router
