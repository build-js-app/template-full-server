import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import config from 'config';
import logger from 'logger';

import {UserModel} from './models/user';
import {CategoryModel} from './models/category';
import {RecordModel} from './models/record';

const models = {
  User: UserModel,
  Record: RecordModel,
  Category: CategoryModel
};

export default {
  init,
  models
};

const dbConfig = config.dataSources.mongo;

async function init() {
  let connectionStr = getConnectionString();

  try {
    let options = {
      connectTimeoutMS: dbConfig.timeout,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    await mongoose.connect(connectionStr, options);
  } catch (err) {
    console.error('Could not connect to MongoDB!');
    logger.error(err);
  }
}

function getConnectionString() {
  let result = 'mongodb://';

  if (dbConfig.username) {
    result += dbConfig.username + ':' + dbConfig.password + '@';
  }

  result += dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;

  return result;
}
