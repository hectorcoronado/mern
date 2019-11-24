const bcrypt = require('bcryptjs')
const config = require('config')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

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

/**
 * @route POST api/auth
 * @desc authenticate user & get token
 * @access public
 */
const authenticateUserValidation = [
  check('email', 'please include a valid email').isEmail(),
  check('password', 'password required').exists()
]
router.post('/', authenticateUserValidation, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // check if user exists
    let user = await User.findOne({ email })

    // if the user isn't found/does not exist/entered wrong password, send error
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
    }

    // check that user-provided password matches encrypted password in db
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] })
    }

    // create payload to include in our jwt
    const payload = {
      user: {
        id: user.id
      }
    }

    const jwtSecret = config.get('jwtSecret')
    const options = { expiresIn: 360000 }
    const callback = (err, token) => {
      if (err) throw err

      // send the token back to the client if all's ok
      res.json({ token })
    }

    jwt.sign(payload, jwtSecret, options, callback)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

module.exports = router
