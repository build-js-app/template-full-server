import * as _ from 'lodash';
import * as crypto from 'crypto';

import db from '../database/database';
import AppError from '../../../appError';

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

async function getUserByEmail(email) {
  const User = db.models.User;

  const user = await User.findOne({email});

  return mapUser(user);
}

async function getLocalUserByEmail(email: string) {
  let user = await getUserByEmail(email);

  let noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) return null;

  return user;
}

async function saveLocalAccount(user, userData) {
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

async function getUserById(id) {
  const User = db.models.User;

  const user = await User.findById(id);

  return mapUser(user);
}

async function getUsers() {
  let User = db.models.User;

  return await User.find();
}

async function getUserByActivationToken(token: string) {
  const users = await getUsers();

  const findUser = _.find(users, (user: any) => {
    return user.profile.local && user.profile.local.activation.token === token;
  });

  return mapUser(findUser);
}

async function refreshActivationToken(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('');

  user.profile.local.activation = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  const result = await user.save();

  return mapUser(result);
}

async function activateUser(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('User not found.');

  user.profile.local.activation = undefined;
  user.profile.local.isActivated = true;

  const result = await user.save();

  return mapUser(result);
}

async function updateUser(userData) {
  let user = await getUserByEmail(userData.email.toLowerCase());

  if (!user) return;

  user.firstName = userData.firstName;
  user.lastName = userData.lastName;

  const result = await user.save();

  return mapUser(result);
}

async function removeUser(id) {
  let User = db.models.User;

  return await User.deleteOne({_id: id});
}

async function resetPassword(userId) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user by Id');

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  const result = await user.save();

  return mapUser(result);
}

async function updateUserPassword(userId, password: string) {
  const User = db.models.User;

  let user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.profile.local.reset = undefined;
  user.profile.local.password = User.generateHash(password);

  const result = await user.save();

  return mapUser(result);
}

async function getUserByResetToken(token: string) {
  const users = await getUsers();

  const findUser = _.find(users, user => {
    return user.profile.local && user.profile.local.reset.token === token;
  });

  return mapUser(findUser);
}

async function refreshResetToken(userId) {
  let user = await getUserById(userId);

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

function mapUser(user) {
  user._doc.id = user._id;

  return user;
}