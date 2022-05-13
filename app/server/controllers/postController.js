const asyncHandler = require('express-async-handler')

const Post = require('../models/post.model')
const User = require('../models/user.model')

/** 
* @desc    Get posts
* @route   GET /api/post
* @access  Private
*/
const getPosts = asyncHandler(async (req, res) => {
const posts = await Post.find({ user: req.user.id })

  res.status(200).json(posts)
})

/**  
* @desc    Create a post
* @route   POST /api/posts
* @access  Private
*/
const createPost = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const post = await Post.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(post)
})

/**  
* @desc    Delete post
* @route   DELETE /api/posts/:id
* @access  Private
*/
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(400)
    throw new Error('Post not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the post user
  if (post.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await post.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = { 
  getPosts,
  createPost,
  deletePost,
}
