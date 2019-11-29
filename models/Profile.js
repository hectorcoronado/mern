const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  /**
   * since every profile will be associated with a user,
   * we need to create a reference to the User model
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  bio: { type: String },
  company: { type: String },
  date: { type: Date, default: Date.now },
  education: [
    {
      current: { type: Boolean, default: false },
      degree: { type: String, required: true },
      description: { type: String },
      fieldofstudy: { type: String, required: true },
      from: { type: Date, required: true },
      school: { type: String, required: true },
      to: { type: Date, required: true }
    }
  ],
  experience: [
    {
      company: { type: String, required: true },
      current: { type: Boolean, default: false },
      description: { type: String },
      from: { type: Date, required: true },
      location: { type: String },
      title: { type: String, required: true },
      to: { type: Date }
    }
  ],
  githubusername: { type: String },
  location: { type: String },
  skills: { type: [String] },
  social: {
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    youtube: { type: String }
  },
  status: { type: String, required: true },
  website: { type: String }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)
