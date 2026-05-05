/**
 * Authentication service
 * Handles all auth-related business logic
 */

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { NotFoundError, UnauthorizedError, ConflictError } = require('../utils/errors.util')

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'
const BCRYPT_ROUNDS = 12

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - Plaintext password
 * @returns {Promise<Object>} Created user object
 * @throws {ConflictError} If email already exists
 * @throws {Error} If database operation fails
 */
const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ConflictError('Email already registered')
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS)

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: 'user'
  })

  await newUser.save()

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  }
}

/**
 * Authenticate user and return JWT token
 * @param {string} email - User's email
 * @param {string} password - Plaintext password to verify
 * @returns {Promise<{user: Object, token: string}>} User object and JWT token
 * @throws {NotFoundError} If no user exists with email
 * @throws {UnauthorizedError} If password does not match
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('User not found with that email')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid password')
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  )

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }
}

module.exports = { registerUser, loginUser }
