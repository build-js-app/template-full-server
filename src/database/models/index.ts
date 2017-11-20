import * as _ from 'lodash';
const Sequelize = require('sequelize');

const models = [require('./category'), require('./record'), require('./user')];

module.exports = {
  init: initModels
};

function initModels(sequelize) {
  let result = {};

  for (let modelInit of models) {
    let model = modelInit.init(sequelize, Sequelize);
    result[_.upperFirst(model.name)] = model;
  }

  for (let modelName of Object.keys(result)) {
    if (result[modelName].associate) {
      result[modelName].associate(result);
    }
  }

  return result;
}
