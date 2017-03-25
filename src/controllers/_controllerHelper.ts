import * as _ from 'lodash';
import * as Joi from 'joi';

export default {
    sendData,
    sendFailureMessage,
    loadSchema
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

    return new Promise(function (resolve, reject) {
        Joi.validate(data, schema, validationOptions, function (err, val) {
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