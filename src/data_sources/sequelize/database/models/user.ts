import * as bcrypt from 'bcrypt-nodejs';

import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
  const fields = {
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

  const model = helper.defineModel('user', fields, sequelize, {
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  model.associate = models => {
    model.hasMany(models.Record, {
      foreignKey: helper.defineForeignKey('userId'),
      onDelete: 'no action'
    });

    model.hasMany(models.Category, {
      foreignKey: helper.defineForeignKey('userId'),
      onDelete: 'no action'
    });
  };

  model.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  return model;
}
