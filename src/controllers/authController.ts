import * as bcrypt from 'bcrypt-nodejs';
import * as Joi from 'joi';
import * as dateFns from 'date-fns';

import helper from './_controllerHelper';
import userRepository from '../repositories/userRepository';
import AppError from '../appError';

export default {
    signUpPost,
    loginPost,
    logOut,
    activate
}

async function signUpPost(req, res) {
    try {
        let userData = await helper.loadSchema(req.body, {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required()
        });

        if (userData.password !== userData.confirmPassword) throw new AppError('Passwords do not match.');

        //Use lower-case e-mails to avoid case-sensitive e-mail matching
        userData.email = userData.email.toLowerCase();

        if (req.session.user) throw new AppError('Log out before signing up.');

        let localUser = await userRepository.getLocalUserByEmail(userData.email);

        let alreadyActivated = localUser && localUser.profile.local.isActivated;
        if (alreadyActivated) throw new AppError('This email is already activated.');

        let user = await userRepository.getUserByEmail(userData.email);

        user = await userRepository.saveLocalAccount(user, userData);

        await helper.sendActivationEmail(user.email, user.profile.local.activation.token);

        let message = 'Activation email was send. Please, check you inbox.';

        return helper.sendData({message}, res);
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

        let user = await userRepository.getLocalUserByEmail(userData.email.toLowerCase());

        if (!user.profile.local.isActivated)
            throw new AppError('Your account is not activated yet. Please check your email for activation letter or sign up again to get a new one.');

        if (user) {
            let isValidPassword = bcrypt.compareSync(userData.password, user.profile.local.password);

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

async function activate(req, res) {
    try {
        let token = req.params.token;

        if (!token) throw new AppError('No activation token provided.');

        let localUser = await userRepository.getUserByActivationToken(token);

        if (!localUser) throw new AppError('Wrong activation token.');

        let activationTime = localUser.profile.local.activation.created;
        let isTokenExpired = dateFns.differenceInHours(activationTime, new Date()) > 24;

        if (isTokenExpired) {
            let user = await userRepository.refreshActivationToken(localUser.id);

            await helper.sendActivationEmail(user.email, user.profile.local.activation.token);

            throw new AppError('Activation token has expired. New activation email was send.');
        } else {
            await userRepository.activateUser(localUser.id);
        }

        return res.redirect('/');
    } catch (err) {
        return helper.sendFailureMessage(err, res);
    }
}