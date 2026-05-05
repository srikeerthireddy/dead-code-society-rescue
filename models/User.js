// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
const mongoose = require('mongoose')

// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
const Schema = mongoose.Schema

/**
 * User schema for MongoDB
 * Represents a user account with email authentication
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user' // either 'user' or 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
