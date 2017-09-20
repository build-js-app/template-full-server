import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
  let fields = {
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

  let model = helper.defineModel('category', fields, sequelize);

  model.associate = function(models) {
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
