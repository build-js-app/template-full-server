import * as mongoose from 'mongoose';

let schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Record', schema);
