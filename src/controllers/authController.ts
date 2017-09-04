import * as bcrypt from 'bcrypt-nodejs';
import * as Joi from 'joi';
import * as dateFns from 'date-fns';
import * as jwt from 'jsonwebtoken';

import helper from './_controllerHelper';
import userRepository from '../repositories/userRepository';
import AppError from '../appError';
import config from '../config';

export default {
  signUpPost,
  loginPost,
  activate,
  forgotPassword,
  resetPassword,
  resetPasswordPost
};

async function signUpPost(req, res) {
  try {
    let userData = await helper.loadSchema(req.body, {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required()
    });

    if (userData.password !== userData.confirmPassword) throw new AppError('Passwords do not match.');

    //Use lower-case e-mails to avoid case-sensitive e-mail matching
    userData.email = userData.email.toLowerCase();

    if (helper.getCurrentUser(req)) throw new AppError('Log out before signing up.');

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
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    });

    let user = await userRepository.getLocalUserByEmail(userData.email.toLowerCase());

    if (!user.profile.local.isActivated)
      throw new AppError(
        'Your account is not activated yet. Please check your email for activation letter or sign up again to get a new one.'
      );

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

    let token = jwt.sign(user, config.auth.jwtKey, {
      expiresIn: config.auth.expiry
    });

    let result = {
      token,
      user
    };

    return helper.sendData(result, res);
  } catch (err) {
    helper.sendFailureMessage(err, res);
  }
}

async function activate(req, res) {
  try {
    let data = {};

    let token = req.params.token;

    let localUser = await userRepository.getUserByActivationToken(token);

    if (!localUser) {
      data = {
        message: 'Wrong activation token.',
        status: 'error'
      };

      return helper.sendData(data, res);
    }

    let activationTime = localUser.profile.local.activation.created;
    let isTokenExpired = dateFns.differenceInHours(activationTime, new Date()) > 24;

    if (isTokenExpired) {
      let user = await userRepository.refreshActivationToken(localUser.id);

      await helper.sendActivationEmail(user.email, user.profile.local.activation.token);

      data = {
        message: 'Activation token has expired. New activation email was send.',
        status: 'warning'
      };

      return helper.sendData(data, res);
    } else {
      await userRepository.activateUser(localUser.id);

      data = {
        message: 'Your account was successfully activated.',
        status: 'success'
      };

      return helper.sendData(data, res);
    }
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function forgotPassword(req, res) {
  try {
    let data = await helper.loadSchema(req.body, {
      email: Joi.string()
        .email()
        .required()
    });

    let email = data.email.toLowerCase();

    let localUser = await userRepository.getLocalUserByEmail(email);

    if (!localUser) throw new AppError('There is no user with provided email.');

    let updatedUser = await userRepository.resetPassword(localUser.id);

    await helper.sendResetPasswordEmail(updatedUser.email, updatedUser.profile.local.reset.token);

    let message = `We've just dropped you an email. Please check your mail to reset your password. Thanks!`;

    return helper.sendData({message}, res);
  } catch (err) {
    helper.sendFailureMessage(err, res);
  }
}

async function resetPassword(req, res) {
  try {
    let token = req.params.token;

    let localUser = await getUserByResetToken(token);

    let data = {
      email: localUser.email,
      token
    };

    return helper.sendData(data, res);
  } catch (err) {
    helper.sendFailureMessage(err, res);
  }
}

async function resetPasswordPost(req, res) {
  try {
    let data = await helper.loadSchema(req.body, {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      token: Joi.string().required()
    });

    if (data.password !== data.confirmPassword) throw new AppError('Passwords do not match.');

    let localUser = await getUserByResetToken(data.token);

    await userRepository.updateUserPassword(localUser.id, data.password);

    let message = 'Your password was reset successfully.';

    helper.sendData({message}, res);
  } catch (err) {
    helper.sendFailureMessage(err, res);
  }
}

async function getUserByResetToken(token) {
  if (!token) throw new AppError('No reset token provided.');

  let localUser = await userRepository.getUserByResetToken(token);

  if (!localUser) throw new AppError('Wrong reset password token.');

  let activationTime = localUser.profile.local.reset.created;

  let isTokenExpired = dateFns.differenceInHours(activationTime, new Date()) > 24;

  if (isTokenExpired) {
    let user = await userRepository.refreshResetToken(localUser.id);

    await helper.sendResetPasswordEmail(user.email, user.profile.local.reset.token);

    throw new AppError('Reset password token has expired. New activation email was send.');
  }

  return localUser;
}
