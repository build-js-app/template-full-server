import config from '../config';
import pathHelper from '../helpers/pathHelper';
import {Sequelize} from 'sequelize';
const models = require('./models/index');

import {UserModel} from '../typings/models/UserModel';
import {CategoryModel} from '../typings/models/CategoryModel';
import {RecordModel} from '../typings/models/RecordModel';

interface Db {
  sequelize: any;
  models: {
    User: UserModel;
    Category: CategoryModel;
    Record: RecordModel;
  };
}

interface DbConnectionOptions {
  dbPath?: string;
  dbName?: string;
}

export default {
  init
};

function init(connectionOptions?: DbConnectionOptions): Db {
  const sequelize = getConnection(connectionOptions);
  const dbModels = models.init(sequelize);

  return {
    sequelize,
    models: dbModels
  };
}

function getConnection(connectionOptions: DbConnectionOptions) {
  const options: any = {
    dialect: config.db.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    },
    //logging: console.log
    logging: false
  };

  if (config.db.dialect === 'sqlite') {
    options.storage = pathHelper.getLocalRelative(`./${config.db.name}.db`);
  } else {
    options.host = config.db.host;
    if (config.db.port) options.port = config.db.port;
  }

  return new Sequelize(config.db.name, config.db.username, config.db.password, options);
}
