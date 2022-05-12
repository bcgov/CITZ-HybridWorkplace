const User = require('../models/user.model')
const bcrypt = require('bcryptjs') //encrypting passwords
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

/**
 * @desc Register a new user
 * @route POST /api/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

/**
 * @desc Login a user
 * @route POST /api/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

/**
 * @desc Get user data
 * @route /api/profile
 * @access Private
 */
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate a JWT for authentication
const generateToken = (id) => {
    return jwt.sign( { id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY, }
    )
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
}