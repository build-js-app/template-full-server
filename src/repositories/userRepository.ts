import * as crypto from 'crypto';

import database from '../database/database';
import {User} from '../database/entities/user';
import AppError from '../appError';

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
  const options = {
    where: {
      email
    }
  };

  const repository = await getRepository();

  return await repository.findOne(options);
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
  const repository = await getRepository();

  return await repository.findOne(id);
}

async function getUsers() {
  const repository = await getRepository();

  return await repository.find();
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
  const repository = await getRepository();

  const user = await getUserById(id);

  if (!user) throw new AppError('Cannot find user by Id');

  return await repository.remove(user);
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

//helper function

async function getRepository() {
  const connection = await database.connect();
  return connection.getRepository(User);
}
