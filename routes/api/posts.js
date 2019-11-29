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
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  }

})

module.exports = router