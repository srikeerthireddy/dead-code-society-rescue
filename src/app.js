require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

// Middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware')

// routes
const routes = require('./routes')

const app = express()

// middleware setup
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// database connection
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/logitrack'
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('--- DATABASE CONNECTED ---')
  })
  .catch((err) => {
    console.log('DATABASE CONNECTION ERROR:')
    console.log(err)
  })

// welcome route
app.get('/', (req, res) => {
  res.json({ message: 'LogiTrack Backend running' })
})

// register routes
app.use('/api', routes)

// 404 handler - must come after all routes
app.use(notFoundHandler)

// Global error handler - MUST be last
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is alive on port ${PORT}`)
  console.log('Wait for MongoDB before testing...')
})

module.exports = app

