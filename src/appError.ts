import * as _ from 'lodash';

interface IAppError {
  code: string;
  data: Object;
  message: string;
  isAppError: boolean;
}

interface AppErrorOptions {
  code: string;
  data?: Object;
}

export class AppError implements AppError {
  message = 'Server Error';
  code = '';
  data: Object;
  isAppError = true;

  constructor(errorOptions) {
    Error.captureStackTrace(this, this.constructor);

    if (_.isString(errorOptions)) {
      this.message = errorOptions;
    } else {
      this.message = 'Server Error';
      this.data = errorOptions.data;
      this.code = errorOptions.code;
    }
  }
}

export default AppError;
