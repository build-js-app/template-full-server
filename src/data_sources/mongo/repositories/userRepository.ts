import * as _ from 'lodash';
import * as crypto from 'crypto';

import db from '../database/database';
import AppError from 'appError';

export default {
  getUserByEmail,
  getLocalUserByEmail,
  saveLocalAccount,
  getUserById,
  getUsers,
  getUserByActivationToken,
  refreshActivationToken,
  activateUser,
  updateUser,
  removeUser,
  resetPassword,
  updateUserPassword,
  getUserByResetToken,
  refreshResetToken
};

async function getUserByEmail(email): Promise<UserDto> {
  const User = db.models.User;

  const user = await User.findOne({email});

  return mapUser(user);
}

async function getLocalUserByEmail(email: string): Promise<UserDto> {
  let user = await getUserByEmail(email);

  let noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) return null;

  return user;
}

async function saveLocalAccount(user, userData): Promise<UserDto> {
  let User = db.models.User;

  let localProfile: any = {};

  localProfile.firstName = userData.firstName;
  localProfile.lastName = userData.lastName;
  localProfile.email = userData.email;
  localProfile.password = User.generateHash(userData.password);

  let activationToken = generateActivationToken();
  localProfile.activation = {
    token: activationToken,
    created: new Date()
  };

  localProfile.isActivated = false;

  let result = null;

  if (user) {
    user.email = userData.email;
    user.profile.local = localProfile;

    result = await user.save();
  } else {
    result = await User.create({
      email: userData.email,
      profile: {
        local: localProfile
      }
    });
  }

  return mapUser(result);
}

async function getUserById(id): Promise<UserDto> {
  const user = await getUserModelById(id);

  return mapUser(user);
}

async function getUsers(): Promise<UserDto[]> {
  let User = db.models.User;

  return await User.find();
}

async function getUserByActivationToken(token: string): Promise<UserDto> {
  const users = await getUsers();

  const findUser = _.find(users, (user: any) => {
    return user.profile.local && user.profile.local.activation.token === token;
  });

  return mapUser(findUser);
}

async function refreshActivationToken(userId: string): Promise<UserDto> {
  let user = await getUserModelById(userId);

  if (!user) throw new AppError('');

  user.profile.local.activation = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  const result = await user.save();

  return mapUser(result);
}

async function activateUser(userId: string): Promise<UserDto> {
  let user = await getUserModelById(userId);

  if (!user) throw new AppError('User not found.');

  user.profile.local.activation = undefined;
  user.profile.local.isActivated = true;

  const result = await user.save();

  return mapUser(result);
}

async function updateUser(userData): Promise<UserDto> {
  const email = userData.email.toLowerCase();

  const User = db.models.User;

  const user = await User.findOne({email});

  if (!user) return;

  user.firstName = userData.firstName;
  user.lastName = userData.lastName;

  const result = await user.save();

  return mapUser(result);
}

async function removeUser(id: string): Promise<void> {
  let User = db.models.User;

  await User.deleteOne({_id: id});
}

async function resetPassword(userId: string): Promise<UserDto> {
  let user = await getUserModelById(userId);

  if (!user) throw new AppError('Cannot find user by Id');

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  const result = await user.save();

  return mapUser(result);
}

async function updateUserPassword(userId, password: string): Promise<UserDto> {
  const User = db.models.User;

  let user = await getUserModelById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.profile.local.reset = undefined;
  user.profile.local.password = User.generateHash(password);

  const result = await user.save();

  return mapUser(result);
}

async function getUserByResetToken(token: string): Promise<UserDto> {
  const users = await getUsers();

  const findUser = _.find(users, user => {
    return user.profile.local && user.profile.local.reset.token === token;
  });

  return mapUser(findUser);
}

async function refreshResetToken(userId): Promise<UserDto> {
  let user = await getUserModelById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  const result = await user.save();

  return mapUser(result);
}

function generateActivationToken(): string {
  let token = crypto.randomBytes(32).toString('hex');
  return token;
}

//helper methods

async function getUserModelById(id: string) {
  const User = db.models.User;

  const user = await User.findById(id);

  return user;
}

function mapUser(user) {
  if (!user) return null;

  user._doc.id = user._id;

  return user;
}
