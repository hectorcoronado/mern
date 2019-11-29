const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userRef = {
  ref: 'users',
  type: Schema.Types.ObjectId
}

const PostSchema = new Schema({
  // we need this schema to be connected to a user, so reference it here:
  user: userRef,
  text: {
    type: String,
    required: true
  },
  // name of the user, not the post; we want the option for a user to delete
  // their account, without deleting all their posts
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  // also ref user here, so we know which user liked what
  likes: [{ user: userRef }],
  comments: [
    { user: userRef,
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
})

module.exports = Post = mongoose.model('post', PostSchema)