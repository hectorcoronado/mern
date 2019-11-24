const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  // get token from header
  const token = req.header('x-auth-token')
  const jwtSecret = config.get('jwtSecret')

  // check if no token exists
  if (!token) {
    return res.status(401).json({ msg: 'no token, authorization denied' })
  }

  // verify token
  try {
    // decode the token w/jwt
    const decoded = jwt.verify(token, jwtSecret)

    // the jwt should have a `user` property in the payload
    // so we assign its value to `req.user`, then we can use
    // this `req.user` in any of our protected routes
    req.user = decoded.user

    next()
  } catch (err) {
    // if there is a token, but it's not valid, this runs
    res.status(401).json({ msg: 'token is not valid' })
  }
}
