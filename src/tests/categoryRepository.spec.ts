import {Sequelize} from 'sequelize';
import {Client} from 'pg';

import config from '../config';
import pathHelper from '../helpers/pathHelper';
import seederDev from '../database/seeders/seederDev';
const models = require('../database/models/index');

import categoryRepository from '../repositories/categoryRepository';
import userRepository from '../repositories/userRepository';

const databaseName = 'test';
const testUserEmail = 'user_a@test.com';

let db = null;
let userId = undefined;

describe('Category repository', () => {
    beforeAll(async () => {
        await createIfNotExists();
        db = await initDb();

        await beforeSeedRoutine(db);
        await seederDev.seedData(db);

        const user = await userRepository.getUserByEmail(testUserEmail);
        if (user) userId = user.id;
    });

    afterAll(async () => {
       await db.sequelize.drop();
    });

    it('should get list of all categories', async () => {
        const categories = await categoryRepository.getCategories(userId);
        expect(categories).toHaveLength(3);
    });
});

async function createIfNotExists() {
    const {host, username, password} = config.db;
    const connectionString = `postgres://${username}:${password}@${host}/postgres`;
  
    try {
      const client = new Client({connectionString});
      client.connect();
  
      await client.query(`CREATE DATABASE "${databaseName}"`);
  
      client.end(); // close the connection
    } catch (err) {}
}

async function beforeSeedRoutine(db) {
    if (db.sequelize.dialect.name === 'postgres') {
      //clear all tables
      await db.sequelize.query('DROP SCHEMA public CASCADE;');
      await db.sequelize.query('CREATE SCHEMA public;');
    }
  
    await db.sequelize.sync({force: true});
}

async function initDb() {
    const options: any = {
        dialect: config.db.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        define: {
          timestamps: false
        },
        logging: false
    };
    
    if (config.db.dialect === 'sqlite') {
        options.storage = pathHelper.getLocalRelative(`./${databaseName}.db`);
    } else {
        options.host = config.db.host;
        if (config.db.port) options.port = config.db.port;
    }

    const sequelize = new Sequelize(databaseName, config.db.username, config.db.password, options);
    const dbModels = models.init(sequelize);

    return {
        sequelize, 
        models: dbModels
    };
}