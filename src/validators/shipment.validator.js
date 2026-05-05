/**
 * Joi validation schemas for shipments
 */

const Joi = require('joi')

/**
 * Schema for creating a new shipment
 * @type {Joi.ObjectSchema}
 */
const createShipmentSchema = Joi.object({
  origin: Joi.string().trim().required().messages({
    'string.empty': 'Origin is required'
  }),
  destination: Joi.string().trim().required().messages({
    'string.empty': 'Destination is required'
  }),
  weight: Joi.number().positive().required().messages({
    'number.positive': 'Weight must be a positive number',
    'any.required': 'Weight is required'
  }),
  carrier: Joi.string().trim().required().messages({
    'string.empty': 'Carrier is required'
  })
})

/**
 * Schema for updating shipment status
 * @type {Joi.ObjectSchema}
 */
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in-progress', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only':
        'Status must be one of: pending, in-progress, delivered, cancelled',
      'any.required': 'Status is required'
    })
})

module.exports = { createShipmentSchema, updateStatusSchema }
