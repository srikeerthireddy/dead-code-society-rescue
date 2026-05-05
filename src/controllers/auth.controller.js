/**
 * Authentication controller
 * Handles auth-related HTTP requests
 */

const authService = require('../services/auth.service')

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const user = await authService.registerUser(name, email, password)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Login user
 * POST /api/auth/login
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { user, token } = await authService.loginUser(email, password)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login }
