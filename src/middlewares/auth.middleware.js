/**
 * Authentication middleware for protected routes
 * Verifies JWT token and attaches user info to req
 */

const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../utils/errors.util')

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

/**
 * Middleware to verify JWT token from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If token is missing or invalid
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return next(new UnauthorizedError('Missing authorization token'))
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new UnauthorizedError('Invalid or expired token'))
    }

    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  })
}

module.exports = { authenticateToken }
