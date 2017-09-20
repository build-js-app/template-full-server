import * as _ from 'lodash';

const crypto = require('crypto');

import dbInit from '../database/database';
import AppError from '../appError';

export default {
  init,
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

const db = dbInit.init();
let userModel = db.models.User;

function init(db) {
  userModel = db.models.User;
}

async function getUserByEmail(email) {
  let options = {
    where: {
      email
    }
  };

  return await userModel.findOne(options);
}

async function getLocalUserByEmail(email: string) {
  let user = await getUserByEmail(email);

  let noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) return null;

  return user;
}

async function saveLocalAccount(user, userData) {
  let localProfile: any = {};

  localProfile.firstName = userData.firstName;
  localProfile.lastName = userData.lastName;
  localProfile.email = userData.email;
  localProfile.password = userModel.generateHash(userData.password);

  let activationToken = generateActivationToken();
  localProfile.activation = {
    token: activationToken,
    created: new Date()
  };

  localProfile.isActivated = false;

  if (user) {
    user.email = userData.email;

    user.set('profile', {local: localProfile});

    return await user.save();
  } else {
    return await userModel.create({
      email: userData.email,
      profile: {
        local: localProfile
      }
    });
  }
}

async function getUserById(id) {
  return await userModel.findById(id);
}

async function getUsers() {
  return await userModel.findAll();
}

async function getUserByActivationToken(token: string) {
  let users = await getUsers();

  let findUser = _.find(users, (user: any) => {
    return user.profile.local && user.profile.local.activation && user.profile.local.activation.token === token;
  });

  return findUser;
}

async function refreshActivationToken(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('');

  user.profile.local.activation = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  return await user.save();
}

async function activateUser(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('User not found.');

  let profile = user.profile;

  profile.local.activation = undefined;
  profile.local.isActivated = true;

  user.set('profile', profile);

  return await user.save();
}

async function updateUser(userData) {
  let user = await getUserByEmail(userData.email.toLowerCase());

  if (!user) throw new AppError('Cannot find user by Id');

  user.firstName = userData.firstName;
  user.lastName = userData.lastName;

  return await user.save();
}

async function removeUser(id) {
  let user = await getUserById(id);

  if (!user) throw new AppError('Cannot find user by Id');

  return await user.destroy();
}

async function resetPassword(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user by Id');

  let profile = user.profile;

  profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  user.set('profile', profile);

  return await user.save();
}

async function updateUserPassword(userId: number, password: string) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user');

  let profile = user.profile;

  profile.local.reset = undefined;
  profile.local.password = userModel.generateHash(password);

  user.set('profile', profile);

  return await user.save();
}

async function getUserByResetToken(token: string) {
  let users = await getUsers();

  let findUser = _.find(users, (user: any) => {
    let local = user.profile.local;
    return local && local.reset && local.reset.token === token;
  });

  return findUser;
}

async function refreshResetToken(userId: number) {
  let user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.profile.local.reset = {
    token: generateActivationToken(),
    created: new Date().toString()
  };

  return await user.save();
}

function generateActivationToken(): string {
  let token = crypto.randomBytes(32).toString('hex');
  return token;
}
