import helper from '../modelHelper';

export function init(sequelize, DataTypes) {
    let fields = {
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

    let options = {
        classMethods: {
            associate: function (models) {
                model.belongsTo(models.Category, {
                    foreignKey: helper.defineForeignKey('categoryId'),
                    onDelete: 'no action'
                });

                model.belongsTo(models.User, {
                    foreignKey: helper.defineForeignKey('userId'),
                    onDelete: 'no action'
                });
            }
        }
    };

    let model = helper.defineModel('record', fields, options, sequelize);

    return model;
}