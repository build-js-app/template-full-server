import * as _ from 'lodash';
const Sequelize = require('sequelize');

const models = [require('./category'), require('./record'), require('./user')];

module.exports = {
  init: initModels
};

function initModels(sequelize) {
  const result = {};

  for (const modelInit of models) {
    const model = modelInit.init(sequelize, Sequelize);
    result[_.upperFirst(model.name)] = model;
  }

  for (const modelName of Object.keys(result)) {
    if (result[modelName].associate) {
      result[modelName].associate(result);
    }
  }

  return result;
}
