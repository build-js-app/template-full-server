import pathHelper from './helpers/pathHelper';
import configBuilder from './helpers/configHelper';

let config = {
  port: 3000,
  isDevLocal: process.env.NODE_ENV !== 'production',
  appVersion: '0.0.1',
  rootUrl: 'http://localhost:3000',
  auth: {
    jwtKey: '',
    expiry: 60 * 60 * 2
  },
  dataAccess: {
    seedOnStart: false,
    dataSource: 'mongo'
  },
  dataSources: {
    mongo: {
      host: 'localhost',
      port: 27017,
      name: 'expense_manager',
      username: '',
      password: '',
      timeout: 5000
    },
    sequelize: {
      host: 'localhost',
      port: 0,
      name: 'expense_manager',
      dialect: '', // 'sqlite'|'postgres' ('mssql'|'mysql' not supported)
      username: '',
      password: '',
      seedOnStart: false
    }
  },
  email: {
    useStubs: false,
    sendGridKey: '',
    auth: {
      user: '',
      password: ''
    },
    fromNoReply: 'noreply@buildapp.com'
  }
};

//TODO fix
//define ENV VARs which override all other values if defined
let envVars = {
  rootUrl: 'ROOT_URL',
  auth: {
    jwtKey: 'JWT_KEY'
  },
  dataAccess: {
    seedOnStart: 'DB_SEED_ON_START'
  },
  dataSources: {
    mongo: {
      host: 'DB_HOST',
      port: 'DB_PORT',
      name: 'DB_NAME',
      username: 'DB_USER',
      password: 'DB_PASSWORD'
    },
    sequelize: {
      host: 'DB_HOST',
      port: 'DB_PORT',
      name: 'DB_NAME',
      username: 'DB_USER',
      password: 'DB_PASSWORD',
      seedOnStart: 'DB_SEED_ON_START'
    }
  },
  email: {
    sendGridKey: 'SENDGRID_KEY'
  }
};

configBuilder.addJsonFile(config, pathHelper.getDataRelative('config.json'), true);

configBuilder.addJsonFile(config, pathHelper.getLocalRelative('config.local.json'));

configBuilder.loadEnvVars(config, envVars);

if (config.isDevLocal) {
  configBuilder.printConfig(config);
}

export default config;
