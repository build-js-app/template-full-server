import * as _ from 'lodash';

const crypto = require('crypto');

import db from '../database/database';
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
    removeUser
}

async function getUserByEmail(email) {
    let User = db.models.User;

    return User.findOne({email});
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
    localProfile.password = new User().generateHash(userData.password);

    let activationToken = generateActivationToken();
    localProfile.activation = {
        token: activationToken,
        created: new Date()
    };

    localProfile.isActivated = false;

    if (user) {
        user.email = userData.email;
        user.profile.local = localProfile;

        return await user.save();
    } else {
        return User.create({
            email: userData.email,
            profile: {
                local: localProfile
            }
        });
    }
}

async function getUserById(id) {
    let User = db.models.User;

    return User.findById(id);
}

function getUsers() {
    let User = db.models.User;

    return User.find();
}

async function getUserByActivationToken(token: string) {
    let users = await getUsers();

    let findUser = _.find(users, (user) => {
        return user.profile.local &&
            user.profile.local.activation.token === token;
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

    user.profile.local.activation = undefined;
    user.profile.local.isActivated = true;

    return await user.save();
}

async function updateUser(userData) {
    let user = await getUserByEmail(userData.email.toLowerCase());

    if (!user) return;

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;

    return user.save();
}

function removeUser(id) {
    let User = db.models.User;

    return User.remove({_id: id});
}

function generateActivationToken(): string {
    let token = crypto.randomBytes(32).toString('hex');
    return token;
}