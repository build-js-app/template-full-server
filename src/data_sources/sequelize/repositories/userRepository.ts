import * as crypto from 'crypto';

import dbInit from '../database/database';
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

const db = dbInit.init();

const userModel = db.models.User;

async function getUserByEmail(email) {
  const options = {
    where: {
      email
    }
  };

  return await userModel.findOne(options);
}

async function getLocalUserByEmail(email: string) {
  const user = await getUserByEmail(email);

  const noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) return null;

  return user;
}

async function saveLocalAccount(user, userData) {
  const localProfile: any = {};

  localProfile.firstName = userData.firstName;
  localProfile.lastName = userData.lastName;
  localProfile.email = userData.email;
  localProfile.password = (userModel as any).generateHash(userData.password);

  const activationToken = generateActivationToken();
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
  return await userModel.findByPk(id);
}

async function getUsers() {
  return await userModel.findAll();
}

async function getUserByActivationToken(token: string) {
  const users = await getUsers();

  const findUser = users.find(user => {
    return user?.profile?.local?.activation && user?.profile?.local?.activation?.token === token;
  });

  return findUser;
}

async function refreshActivationToken(userId: number) {
  const user = await getUserById(userId);

  if (!user) throw new AppError('');

  user.set('profile.local.activation.token', generateActivationToken());
  user.set('profile.local.activation.created', new Date().toString());

  return await user.save();
}

async function activateUser(userId: number) {
  const user = await getUserById(userId);

  if (!user) throw new AppError('User not found.');

  user.set('profile.local.activation', undefined);
  user.set('profile.local.isActivated', true);

  return await user.save();
}

async function updateUser(userData) {
  const user = await getUserByEmail(userData.email.toLowerCase());

  if (!user) throw new AppError('Cannot find user by Id');

  user.firstName = userData.firstName;
  user.lastName = userData.lastName;

  return await user.save();
}

async function removeUser(id) {
  const user = await getUserById(id);

  if (!user) throw new AppError('Cannot find user by Id');

  return await user.destroy();
}

async function resetPassword(userId: number) {
  const user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user by Id');

  user.set('profile.local.reset.token', generateActivationToken());
  user.set('profile.local.reset.created', new Date().toString());

  return await user.save();
}

async function updateUserPassword(userId: number, password: string) {
  const user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.set('profile.local.reset', undefined);
  user.set('profile.local.password', (userModel as any).generateHash(password));

  return await user.save();
}

async function getUserByResetToken(token: string) {
  const users = await getUsers();

  const findUser = users.find(user => {
    const local = user.profile.local;
    return local?.reset && local?.reset?.token === token;
  });

  return findUser;
}

async function refreshResetToken(userId: number) {
  const user = await getUserById(userId);

  if (!user) throw new AppError('Cannot find user');

  user.set('profile.local.reset.token', generateActivationToken());
  user.set('profile.local.reset.created', new Date().toString());

  return await user.save();
}

function generateActivationToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}
