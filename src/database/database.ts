import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import config from '../config';
import logger from '../logger';

let db = null;
let models = {
  User: null,
  Record: null,
  Category: null
};

export default {
  init,
  models
};

async function init() {
  mongoose.Promise = Promise;

  let connectionStr = getConnectionString();

  try {
    await mongoose.connect(connectionStr, {
      connectTimeoutMS: config.db.timeout
    });
  } catch (err) {
    console.error('Could not connect to MongoDB!');
    logger.error(err);
  }

  //init models
  for (let modelName of Object.keys(models)) {
    let model = require(`./models/${_.lowerCase(modelName)}`);

    models[modelName] = model;
  }
}

function getConnectionString() {
  let result = 'mongodb://';

  if (config.db.username) {
    result += config.db.username + ':' + config.db.password + '@';
  }

  result += config.db.host + ':' + config.db.port + '/' + config.db.name;

  return result;
}
