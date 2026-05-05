/**
 * User controller
 * Handles user-related HTTP requests
 */

const userService = require('../services/user.service')

/**
 * Get current user profile
 * GET /api/users/profile
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.userId)

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile }
