/**
 * Input validation middleware using Joi schemas
 */

const { ValidationError } = require('../utils/errors.util')

/**
 * Middleware factory for validating request body against a Joi schema
 * @param {Object} schema - Joi schema for validation
 * @returns {Function} Middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const messages = error.details.map((detail) => detail.message)
      return next(new ValidationError(messages.join('; ')))
    }

    req.body = value
    next()
  }
}

module.exports = { validateRequest }
