import * as bcrypt from 'bcrypt-nodejs';
import * as Joi from 'joi';

const crypto = require('crypto');

import helper from './_controllerHelper';
import userRepository from '../repositories/userRepository';
import AppError from '../appError';

export default {
    signUpPost,
    loginPost,
    logOut
}

async function signUpPost(req, res) {
    try {
        let userData = await helper.loadSchema(req.body, {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        let user = await userRepository.getUserByEmail(userData.email.toLowerCase());

        if (user) {
            throw new AppError('The email address you have entered is already registered.');
        }

        let data = await userRepository.addUser(userData);

        await helper.sendActivationEmail(data.email, generateActivationToken());

        return helper.sendData(data, res);
    } catch (err) {
        helper.sendFailureMessage(err, res);
    }
}

async function loginPost(req, res) {
    try {
        let loginSuccess = true;

        let userData = await helper.loadSchema(req.body, {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        let user = await userRepository.getUserByEmail(userData.email.toLowerCase());

        if (user) {
            let isValidPassword = bcrypt.compareSync(userData.password, user.password);

            if (!isValidPassword) loginSuccess = false;
        } else {
            loginSuccess = false;
        }

        if (!loginSuccess) {
            throw new AppError('The email address or password that you entered is not valid');
        }

        user = user.toObject();

        req.session.user = user;

        return helper.sendData(user, res);
    } catch (err) {
        helper.sendFailureMessage(err, res);
    }
}

async function logOut(req, res) {
    try {
        req.session.user = null;

        return helper.sendData({}, res);
    } catch (err) {
        helper.sendFailureMessage(err, res);
    }
}

//helper methods
function generateActivationToken(): string {
    let token = crypto.randomBytes(32).toString('hex');
    return token;
}