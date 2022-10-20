import * as crypto from 'crypto';

import dbInit from '../database/database';
import AppError from 'appError';

import {UserInstance} from '../typings/models/UserModel';

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

async function getUserByEmail(email): Promise<UserDto> {
  const options = {
    where: {
      email
    }
  };

  const user = await userModel.findOne(options);

  return mapUser(user);
}

async function getLocalUserByEmail(email: string): Promise<UserDto> {
  const user = await getUserByEmail(email);

  const noLocalProfile = !user || !user.profile.local;

  if (noLocalProfile) return null;

  return user;
}

async function saveLocalAccount(user, userData): Promise<UserDto> {
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

  let result = null;

  if (user) {
    user.email = userData.email;

    user.set('profile', {local: localProfile});

    result = await user.save();
  } else {
    result = await userModel.create({
      email: userData.email,
      profile: {
        local: localProfile
      }
    });
  }

  return mapUser(result);
}

async function getUserById(id: string): Promise<UserDto> {
  const result = await userModel.findByPk(id);
  return mapUser(result);
}

async function getUsers(): Promise<UserDto[]> {
  const userModels = await userModel.findAll();
  return userModels.map(u => mapUser(u));
}

async function getUserByActivationToken(token: string): Promise<UserDto> {
  const users = await getUsers();

  const findUser = users.find(user => {
    return user?.profile?.local?.activation && user?.profile?.local?.activation?.token === token;
  });

  return findUser;
}

async function refreshActivationToken(userId: string): Promise<UserDto> {
  const userModel = await getUserModelById(userId);

  if (!userModel) throw new AppError('');

  userModel.set('profile.local.activation.token', generateActivationToken());
  userModel.set('profile.local.activation.created', new Date().toString());

  const result = await userModel.save();
  return mapUser(result);
}

async function activateUser(userId: string): Promise<UserDto> {
  const userModel = await getUserModelById(userId);

  if (!userModel) throw new AppError('User not found.');

  userModel.set('profile.local.activation', undefined);
  userModel.set('profile.local.isActivated', true);

  const result = await userModel.save();
  return mapUser(result);
}

async function updateUser(userData): Promise<UserDto> {
  const userModel = await getUserModelByEmail(userData.email.toLowerCase());

  if (!userModel) throw new AppError('Cannot find user by Id');

  userModel.firstName = userData.firstName;
  userModel.lastName = userData.lastName;

  const result = await userModel.save();
  return mapUser(result);
}

async function removeUser(id): Promise<void> {
  const userModel = await getUserModelById(id);

  if (!userModel) throw new AppError('Cannot find user by Id');

  await userModel.destroy();
}

async function resetPassword(userId): Promise<UserDto> {
  const userModel = await getUserModelById(userId);

  if (!userModel) throw new AppError('Cannot find user by Id');

  userModel.set('profile.local.reset.token', generateActivationToken());
  userModel.set('profile.local.reset.created', new Date().toString());

  const result = await userModel.save();
  return mapUser(result);
}

async function updateUserPassword(userId, password: string): Promise<UserDto> {
  const userModel = await getUserModelById(userId);

  if (!userModel) throw new AppError('Cannot find user');

  userModel.set('profile.local.reset', undefined);
  userModel.set('profile.local.password', (userModel as any).generateHash(password));

  const result = await userModel.save();
  return mapUser(result);
}

async function getUserByResetToken(token: string): Promise<UserDto> {
  const users = await getUsers();

  const findUser = users.find(user => {
    const local = user.profile.local;
    return local?.reset && local?.reset?.token === token;
  });

  return findUser;
}

async function refreshResetToken(userId): Promise<UserDto> {
  const userModel = await getUserModelById(userId);

  if (!userModel) throw new AppError('Cannot find user');

  userModel.set('profile.local.reset.token', generateActivationToken());
  userModel.set('profile.local.reset.created', new Date().toString());

  const result = await userModel.save();
  return mapUser(result);
}

function generateActivationToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}

//helper methods

async function getUserModelById(id): Promise<UserInstance> {
  return await userModel.findByPk(id);
}

async function getUserModelByEmail(email): Promise<UserInstance> {
  const options = {
    where: {
      email
    }
  };

  return await userModel.findOne(options);
}

function mapUser(userModel: UserInstance): UserDto {
  if (!userModel) return null;

  const record: UserDto = {
    id: userModel.id.toString(),
    firstName: userModel.firstName,
    lastName: userModel.lastName,
    email: userModel.email,
    profile: userModel.profile
  };

  return record;
}
