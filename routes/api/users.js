const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

/**
 * @route POST api/users
 * @desc register user
 * @access public
 */
const usersPostValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
]
router.post('/', usersPostValidation, (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    res.send('users route')
})

module.exports = router