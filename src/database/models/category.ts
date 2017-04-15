import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
    let fields = {
        _id: {
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

    let options = {
        classMethods: {
            associate: function (models) {
                model.hasMany(models.Record, {
                    foreignKey: helper.defineForeignKey('categoryId'),
                    onDelete: 'no action'
                });
            }
        }
    };

    let model = helper.defineModel('category', fields, options, sequelize);

    return model;
}