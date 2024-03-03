const mongoose = require('mongoose')

const Schema = mongoose.Schema

const savingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Saving', savingSchema)