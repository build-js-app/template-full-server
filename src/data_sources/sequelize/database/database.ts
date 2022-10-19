import config from 'config';
import pathHelper from 'helpers/pathHelper';
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

const dbConfig = config.dataSources.sequelize;

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
    dialect: dbConfig.dialect,
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

  if (dbConfig.dialect === 'sqlite') {
    options.storage = pathHelper.getLocalRelative(`./${dbConfig.name}.db`);
  } else {
    options.host = dbConfig.host;
    if (dbConfig.port) options.port = dbConfig.port;
  }

  return new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, options);
}
