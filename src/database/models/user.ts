import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

let schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true}
  },
  profile: {
    local: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      isActivated: {
        type: Boolean,
        required: true,
        default: false
      },
      activation: {
        token: {
          type: String
        },
        created: {
          type: Date
        }
      },
      reset: {
        token: {
          type: String
        },
        created: {
          type: Date
        }
      }
    },
    google: {},
    facebook: {}
  }
});

// generating a hash
schema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('User', schema);
