const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

/**
 * @route GET api/profile/me
 * @desc get current user's profile
 * @access private
 */
router.get('/me', auth, async (req, res) => {
  try {
    /**
     * create variable based on our Profile model's `user` field,
     * which is set to the `ObjectId` of the user; we also want to
     * get the user's name and avatar from the user model
     */
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile for this user' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

/**
 * @route POST api/profile/
 * @desc create or update a user profile
 * @access private
 */
const createOrUpdateUserProfileValidation = [
  auth,
  [
    check('status', 'status is required')
      .not()
      .isEmpty(),
    check('skills', 'skills is required')
      .not()
      .isEmpty()
  ]
]
router.post('/', createOrUpdateUserProfileValidation, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    bio,
    company,
    facebook,
    githubusername,
    instagram,
    linkedin,
    location,
    skills,
    status,
    twitter,
    website,
    youtube
  } = req.body

  // build profile object:
  const profileFields = {}

  // set the user from the token that was sent
  profileFields.user = req.user.id

  if (bio) profileFields.bio = bio
  if (company) profileFields.company = company
  if (githubusername) profileFields.githubusername = githubusername
  if (location) profileFields.location = location
  if (status) profileFields.status = status
  if (website) profileFields.website = website

  // convert the skills csv into array, removing any spaces in between each skill
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  // build social object (need to define to avoid error "can't find youtube of undefined")
  profileFields.social = {}

  if (instagram) profileFields.social.instagram = instagram
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (twitter) profileFields.social.twitter = twitter
  if (youtube) profileFields.social.youtube = youtube

  try {
    /**
     * remember that `user` in profile schema is set to user's ObjectId,
     * and we can match that to `req.user.id`
     */
    let profile = await Profile.findOne({ user: req.user.id })

    // if profile already exists, update it
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )

      return res.json(profile)
    }

    // create a profile if one doesn't exist
    profile = new Profile(profileFields)

    await profile.save()
    return res.json(profile)
  } catch (err) {
    console.error(err.message)

    res.status(500).send('server error')
  }
})

module.exports = router
