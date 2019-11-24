const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const User = require('../../models/User')

/**
 * @route GET api/auth
 * @desc test route
 * @access public
 */
router.get('/', auth, async (req, res) => {
  try {
    /**
     * since this is a protected route,
     * and we're using the token, w/`id` in its payload,
     * and in our middleware, `req.user` is set to the user in token
     * we can access it anywhere in a protected route
     *
     * we don't want to return the `password`, therfore `select()` is used
     */
    const user = await User.findById(req.user.id).select('-password')

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

module.exports = router
