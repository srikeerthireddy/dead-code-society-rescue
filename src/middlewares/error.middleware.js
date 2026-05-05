/**
 * Global error handling middleware
 * Must be registered LAST in app.use() order
 */

const { AppError } = require('../utils/errors.util')

/**
 * Centralized error handler middleware
 * Catches all errors from routes and middlewares
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // If it's an AppError, use its statusCode and message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode
    })
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: err.message,
      statusCode: 422
    })
  }

  // Handle Mongoose cast errors (invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      statusCode: 400
    })
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    statusCode: 500
  })
}

/**
 * 404 Not Found handler
 * Should be registered AFTER all routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404
  })
}

module.exports = { errorHandler, notFoundHandler }
