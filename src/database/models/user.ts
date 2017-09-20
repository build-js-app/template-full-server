import * as bcrypt from 'bcrypt-nodejs';

import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
  let fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {isEmail: true}
    },
    profile: {
      type: DataTypes.JSON //local, google, facebook
    }
  };

  let model = helper.defineModel('user', fields, sequelize);

  model.associate = function(models) {
    model.hasMany(models.Record, {
      foreignKey: helper.defineForeignKey('userId'),
      onDelete: 'no action'
    });

    model.hasMany(models.Category, {
      foreignKey: helper.defineForeignKey('userId'),
      onDelete: 'no action'
    });
  };

  model.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  return model;
}
