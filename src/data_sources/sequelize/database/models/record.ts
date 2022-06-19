import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
  const fields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE
    },
    cost: {
      type: DataTypes.FLOAT
    },
    note: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER
    }
  };

  const model = helper.defineModel('record', fields, sequelize);

  model.associate = models => {
    model.belongsTo(models.Category, {
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
