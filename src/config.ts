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
  db: {
    host: 'localhost',
    port: 27017,
    name: 'expense-manager',
    username: '',
    password: '',
    timeout: 5000,
    seedOnStart: false
  },
  email: {
    useStubs: true,
    fromNoReply: 'noreply@buildapp.com',
    transport: {
      auth: {
        user: '',
        pass: ''
      }
    }
  }
};

configBuilder.addJsonFile(config, pathHelper.getDataRelative('config.json'), true);

configBuilder.addJsonFile(config, pathHelper.getLocalRelative('config.local.json'));

if (config.isDevLocal) {
  configBuilder.printConfig(config);
}

export default config;
