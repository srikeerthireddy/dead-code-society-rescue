/**
 * User service
 * Handles user-related business logic
 */

const User = require('../../models/User')
const { NotFoundError } = require('../utils/errors.util')

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object (without password)
 * @throws {NotFoundError} If user not found
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password')

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user.toObject()
}

module.exports = { getUserById }
