import * as fs from 'fs-extra';
import pathHelper from './helpers/pathHelper';

let logConfig = true;
let config = {
  port: 3000,
  isDevLocal: process.env.NODE_ENV !== 'production',
  appVersion: '0.0.1',
  parseServerUrl: '???',
  rootUrl: 'http://localhost:3000',
  auth: {
    jwtKey: '',
    expiry: 60 * 60 * 24 // one day
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'expense-manager',
    username: '',
    password: ''
  },
  email: {
    useStubs: false,
    fromNoReply: 'noreply@buildapp.com'
  }
};

function tryReadConfigFile(path) {
  try {
    return fs.readJsonSync(path);
  } catch (err) {
    return {};
  }
}

function loadEnvVars(config) {
  if (process.env.PARSE_SERVER_URL) {
    config.parseServerUrl = process.env.PARSE_SERVER_URL;
  }

  if (process.env.PARSE_APP_ID) {
    config.parseAppId = process.env.PARSE_APP_ID;
  }
}

let defaultFile = tryReadConfigFile(pathHelper.getDataRelative('config.json'));
Object.assign(config, defaultFile);

let localFile = tryReadConfigFile(pathHelper.getLocalRelative('config.local.json'));
Object.assign(config, localFile);

loadEnvVars(config);

if (logConfig) {
  console.log('App configuration:');
  console.log(JSON.stringify(config, null, 2));
}

export default config;
