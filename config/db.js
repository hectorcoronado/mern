const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI')
const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const connectDB = async () => {
  try {
    await mongoose.connect(db, options)
    console.log('mongoDB connected...')
  } catch (err) {
    console.error(err.message)
    // exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
