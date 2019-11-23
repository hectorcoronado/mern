const bcrypt = require('bcryptjs')
const express = require('express')
const gravatar = require('gravatar')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

/**
 * @route POST api/users
 * @desc register user
 * @access public
 */
const usersPostValidation = [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 })
]
router.post('/', usersPostValidation, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, name, password } = req.body
  try {
    // check if user exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'user already exists' }] })
    }

    // get users gravatar (based on their email)
    const avatar = gravatar.url(email, {
      s: '200', // size of the avatar
      r: 'pg', // "rating", so if it's e.g. a dick pic, no
      d: 'mm' // default image
    })

    user = new User({
      avatar,
      email,
      name,
      password
    })

    /**
     * encyrp the password with bcyrpt:
     *  1. create a salt
     *  2. hash the user's password w/generated salt
     */
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    // return jsonwebtoken
    res.send('user registered')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

module.exports = router
