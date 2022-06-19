import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
  const fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER
    }
  };

  const model = helper.defineModel('category', fields, sequelize);

  model.associate = models => {
    model.hasMany(models.Record, {
      foreignKey: helper.defineForeignKey('categoryId'),
      onDelete: 'no action'
    });

    model.belongsTo(models.User, {
      foreignKey: helper.defineForeignKey('userId'),
      onDelete: 'no action'
    });
  };

  return model;
}
