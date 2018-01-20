import * as _ from 'lodash';
import * as Joi from 'joi';

import config from '../config';
import emailHelper from '../helpers/emailHelper';
import logger from '../logger';

export default {
  sendData,
  sendFailureMessage,
  loadSchema,
  sendActivationEmail,
  sendResetPasswordEmail,
  getCurrentUser
};

function sendFailureMessage(error, res) {
  let statusCode = 500;
  let message = 'Server Error';
  let status = 'error';

  //Joi validation error
  if (error.isValidationError) {
    statusCode = 400;
    message = error.message;
    status = 'validation error';
  }

  let mongooseError = _.get(error, 'response.data.error');
  if (mongooseError) {
    statusCode = 400;
    message = `Schema validation error: ${mongooseError}`;
    status = 'validation error';
  }

  if (error.isAppError) {
    message = error.message;
  } else {
    //log unknown errors
    logger.error(error);
  }

  res.status(statusCode).send({
    status,
    message
  });
}

function sendData(data, res) {
  res.status(200).send({
    status: 'ok',
    data: data
  });
}

function loadSchema(data, schema): Promise<any> {
  let validationOptions = {
    stripUnknown: true
  };

  return new Promise(function(resolve, reject) {
    Joi.validate(data, schema, validationOptions, function(err, val) {
      if (!err) return resolve(val);

      let error = null;

      if (err.name !== 'ValidationError') {
        error = new Error('Unsupported Validation Error');
        return reject(err);
      }

      let validationMessage = err.details[0].message;

      error = new Error('Validation Error');
      error.isValidationError = true;
      error.message = validationMessage;

      return reject(error);
    });
  });
}

function sendActivationEmail(email, token) {
  let data = {
    token,
    siteRootUrl: config.rootUrl
  };

  return emailHelper.sendEmailTemplate('activation', data, {
    to: email,
    from: config.email.fromNoReply
  });
}

function sendResetPasswordEmail(email, token) {
  let data = {
    token,
    siteRootUrl: config.rootUrl
  };

  return emailHelper.sendEmailTemplate('password_reset', data, {
    to: email,
    from: config.email.fromNoReply
  });
}

function getCurrentUser(req) {
  return req.currentUser;
}
