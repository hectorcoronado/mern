const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const auth = require('../../middleware/auth')

// models
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

/**
 * @route POST api/posts
 * @desc create a post
 * @access private
 */
const createPostValidation = [
  check('text', 'text is required').not().isEmpty()
]
router.post('/', [auth, createPostValidation], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // we will need the user's name, avatar (we're not sending it w/req, & we omt )
    const user = await User.findById(req.user.id).select('-password')
  
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })

    const post = await newPost.save()

    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

/**
 * @route GET api/posts
 * @desc get all posts
 * @access private (we can't see the posts page unless we're logged in)
 */
router.get('/', auth, async (req, res) => {
  try {
    // find all posts and sort by date (newest first)
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

/**
 * @route GET api/posts/:id
 * @desc get post by id
 * @access private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    // find post from url's id param
    const post = await Post.findById(req.params.id)
    
    if (!post) {
      return res.status(404).json({ msg: 'post not found' })
    }
    
    res.json(post)
  } catch (err) {
    console.error(err.message)
    
    // if what gets passed in isn't a valid id, this will run
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' })
    }
    
    res.status(500).send('server error')
  }
})

/**
 * @route DELETE api/posts/:id
 * @desc delete a post by id
 * @access private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // find post from url's id param
    const post = await Post.findById(req.params.id)

    // if there is no such post, return error
    if (!post) {
      return res.status(404).json({ msg: 'post not found' })
    }

    /**
     * ascertain that user deleting post is owner of it
     *  1. if `post.user` does not eq `req.user.id`, the user isn't authorized
     *  2. since `req.user.id` is a string, and `post.user` is ObjectId, convert it
     */ 
    if (post.user.toString() !== req.user.id) {

      console.log('post.user:', post.user.toString())
      console.log('req.user.id:', req.user.id)
      return res.status(401).json({ msg: 'user not authorized' })
    }

    await post.remove()

    res.json({ msg: 'post removed' })
  } catch (err) {
    console.error(err.message)

    // if what gets passed in isn't a valid id, this will run
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' })
    }

    res.status(500).send('server error')
  }
})

module.exports = router