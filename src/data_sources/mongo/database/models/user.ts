import {Model, Schema, model, Document} from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

interface IUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: any;
}

interface UserModelType extends Model<IUser> {
  generateHash(password: string): string;
}

const userSchema = new Schema<IUser, UserModelType>({
  email: {
    type: String,
    required: true
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
userSchema.static('generateHash', function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
});

export const UserModel = model<IUser, UserModelType>('User', userSchema);
