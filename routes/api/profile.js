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

/**
 * @route GET api/profile/
 * @desc get all profiles
 * @access public
 */
router.get('/', async (req, res) => {
  try {
    // get profiles, and add the `name` and `avatar` fields from user collection
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])

    res.json(profiles)
  } catch (err) {
    console.error(err.message)

    res.status(500).send('server error')
  }
})

/**
 * @route GET api/profile/user/:user_id
 * @desc get profile by user id
 * @access public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    // get profile, and add the `name` and `avatar` fields from user collection
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar'])

    if (!profile) return res.status(400).json({ msg: 'profile not found' })

    res.json(profile)
  } catch (err) {
    console.error(err.message)

    /**
     * we need to check for a specific kind of message; if we enter in an invalid user id
     */
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'profile not found' })
    }

    res.status(500).send('server error')
  }
})

/**
 * @route DELETE api/profile/
 * @desc delete profile, user & posts
 * @access private
 */
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts

    /**
     * remove profile
     * this is a private method so we have access to the token
     */
    await Profile.findOneAndRemove({ user: req.user.id })
    // ...and remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'user and profile deleted ' })
  } catch (err) {
    console.error(err.message)

    res.status(500).send('server error')
  }
})

/**
 * @route PUT api/profile/experience
 * @desc add profile experience
 * @access private
 */
const addProfileExperienceValidation = [
  check('title', 'title is required')
    .not()
    .isEmpty(),
  check('company', 'company is required')
    .not()
    .isEmpty(),
  check('from', 'from date is required')
    .not()
    .isEmpty()
]
router.put(
  '/experience',
  [auth, addProfileExperienceValidation],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      current,
      description,
      from,
      location,
      title,
      to
    } = req.body

    const newExp = {
      company,
      current,
      description,
      from,
      location,
      title,
      to
    }

    try {
      // first, fetch profile we want to add experience to
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
  }
)

module.exports = router
