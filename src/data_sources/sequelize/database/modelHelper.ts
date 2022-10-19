import * as _ from 'lodash';

export default {
  getName: getDbName,
  defineForeignKey,
  defineModel
};

function getDbName(name) {
  return _.snakeCase(name);
}

function defineForeignKey(name) {
  return {
    name: name,
    field: getDbName(name)
  };
}

function defineModel(name: string, fields, sequelize, options: any = {}) {
  options.freezeTableName = true;
  options.tableName = getDbName(name);

  for (const fieldKey of Object.keys(fields)) {
    fields[fieldKey].field = getDbName(fieldKey);
  }

  return sequelize.define(name, fields, options);
}
