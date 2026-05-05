/**
 * Standardized response formatting utility
 */

/**
 * Success response formatter
 * @param {any} data - Data to return to client
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default 200)
 * @returns {Object} Formatted response object
 */
const success = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    statusCode,
    data
  }
}

/**
 * Error response formatter
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @returns {Object} Formatted error response object
 */
const error = (errorMessage, statusCode = 500) => {
  return {
    success: false,
    error: errorMessage,
    statusCode
  }
}

module.exports = { success, error }
