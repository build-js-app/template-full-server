import {Client} from 'pg';
import * as _ from 'lodash';

import dbInit from './database';
import seeder from './seeders/seederDev';
import config from 'config';

export default {
  createDb
};

const dbConfig = config.dataSources.mongo;

async function createDb() {
  try {
    const db = dbInit.init();

    await beforeSeedRoutine(db);

    await seeder.seedData(db);

    await afterSeedRoutine(db);

    console.log('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.log(`Check DB config values. Create DB if not exists.`);
    console.log(`Error: ${err}`);
  }
}

async function createPostgresDbIfNotExists() {
  const {host, name: dbName, username, password} = dbConfig;
  const connectionString = `postgres://${username}:${password}@${host}/postgres`;

  try {
    const client = new Client({connectionString});
    client.connect();

    await client.query(`CREATE DATABASE "${dbName}"`);

    client.end(); // close the connection
  } catch (err) {}
}

async function beforeSeedRoutine(db) {
  if (db.sequelize.dialect.name === 'postgres') {
    if (config.isDevLocal) {
      await createPostgresDbIfNotExists();
    }

    //clear all tables
    await db.sequelize.query('DROP SCHEMA public CASCADE;');
    await db.sequelize.query('CREATE SCHEMA public;');
  }

  await db.sequelize.sync({force: true});
}

async function afterSeedRoutine(db) {
  if (db.sequelize.dialect.name === 'postgres') {
    for (const model of _.toArray(db.models)) {
      await updatePostgresSequence(model, db);
    }
  }
}

function updatePostgresSequence(model, db) {
  const tableName = model.tableName;

  const idField = model.autoIncrementAttribute;

  const sql = `SELECT setval('"${tableName}_id_seq"', (SELECT MAX("${idField}") FROM "${tableName}"));`;

  return db.sequelize.query(sql);
}
