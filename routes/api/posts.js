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
    console.log(req)
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

/*********/
/* LIKES */
/*********/

/**
 * @route PUT api/posts/like/:id
 * @desc  like a post
 * @access private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    /**
     *  check if the post has already been liked by current user:
     *  - `req.user.id` is the current logged in user
     *  - the filter fn return something *only* if it matches, therefore check for length
     *  - if length is greater than 0, it's already been 'liked'
     */
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0)  {
      return res.status(400).json({  msg: 'post already liked' })
    }

    /**
     * if it hasn't been liked, 
     * - add an object to the `likes` array, with a key of `user` and value of their `id`
     * - this enables the above check for previous likes
     */
    post.likes.unshift({ user: req.user.id })

    await post.save()

    // and just return the likes so that we can access them in the front end/UI
    res.json(post.likes)
  } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
  }
})

/**
 * @route PUT api/posts/unlike/:id
 * @desc  unlike a post
 * @access private
 */
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    /**
     *  check if the post has already been liked by current user:
     *  - `req.user.id` is the current logged in user
     *  - the filter fn return something *only* if it matches, therefore check for length
     *  - if length is equal to 0, the logged in user hasn't liked it yet, so there's nothing to do
     */
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0)  {
      return res.status(400).json({  msg: 'post has not yet been liked' })
    }

    // get index of like to be removed (this is very similar to `experience`)
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

    // use `removeIndex` to splice 1 element from the `likes` array 
    post.likes.splice(removeIndex, 1)

    await post.save()

    // and just return the likes so that we can access them in the front end/UI
    res.json(post.likes)
  } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
  }
})

/************/
/* COMMENTS */
/************/

/**
 * @route POST api/posts/comment/:id
 * @desc comment on a post
 * @access private
 */
const createCommentValidation = [
  check('text', 'text is required').not().isEmpty()
]
router.post('/comment/:id', [auth, createCommentValidation], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // we will need the user's name, avatar (we're not sending it w/req, & we omt )
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }

    // add the new comment to the first index of comments array
    post.comments.unshift(newComment)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

/**
 * @route DELETE api/posts/comment/:id/:commentId
 * @desc delete comment
 * @access private
 */
router.delete('/comment/:id/:commentId', auth, async(req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.commentId)

    // make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'comment does not exist' })
    }

    // check user (needs to be same user that made the comment)
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' })
    }


    // get index of comment to be removed (this is very similar to `comment`s)
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

    // use `removeIndex` to splice 1 element from the `comments` array 
    post.comments.splice(removeIndex, 1)

    await post.save()

    // and just return the comments so that we can access them in the front end/UI
    res.json(post.comments)
    
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

module.exports = router