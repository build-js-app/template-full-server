import config from '../config';
const Sequelize = require('sequelize');
const path = require('path');
const models = require('./models/index');

interface Db {
    sequelize: any,
    models: any
}

interface DbConnectionOptions {
    dbPath?: string,
    dbName?: string
}

export default {
    init
};

function init(connectionOptions?: DbConnectionOptions): Db {
    const sequelize = getConnection(connectionOptions);
    const dbModels = models.init(sequelize);

    return {
        sequelize,
        models: dbModels
    };
}

function getConnection(connectionOptions: DbConnectionOptions) {
    let options = {
        dialect: 'postgres',
        host: config.db.host,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        define: {
            timestamps: false
        },
        //logging: console.log
        logging: false,
    };

    return new Sequelize(config.db.name, config.db.username, config.db.password, options);
}