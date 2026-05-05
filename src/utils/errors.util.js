/**
 * Custom error classes for consistent error handling
 * Each error type carries its own HTTP status code
 */

/**
 * Base application error class
 * @class AppError
 */
class AppError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 422)
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404)
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, 401)
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409)
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, 403)
  }
}

class InternalServerError extends AppError {
  constructor(message) {
    super(message, 500)
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  InternalServerError
}
