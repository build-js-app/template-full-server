import {Client} from 'pg';
import * as _ from 'lodash';

import dbInit from './database';
import seeder from './seeders/seederDev';
import config from '../config';
import {error} from 'util';

export default {
  createDb
};

async function createDb() {
  try {
    await createIfNotExists();

    const db = dbInit.init();

    //clear all tables
    await db.sequelize.query('DROP SCHEMA public CASCADE;');
    await db.sequelize.query('CREATE SCHEMA public;');

    await db.sequelize.sync({force: true});

    await seeder.seedData(db);

    await postImportRoutine(db);

    console.log('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.log(`Check DB config values. Create DB if not exists.`);
    console.log(`Error: ${err}`);
  }
}

async function createIfNotExists() {
  let {host, name: dbName, username, password} = config.db;
  let connectionString = `postgres://${username}:${password}@${host}/postgres`;

  try {
    let client = new Client({connectionString});
    client.connect();

    await client.query(`CREATE DATABASE "${dbName}"`);

    client.end(); // close the connection
  } catch (err) {}
}

async function postImportRoutine(db) {
  if (db.sequelize.dialect.name === 'postgres') {
    for (let model of _.toArray(db.models)) {
      await updatePostgresSequence(model, db);
    }
  }
}

function updatePostgresSequence(model, db) {
  let tableName = model.tableName;

  let idField = model.autoIncrementAttribute;

  let sql = `SELECT setval('"${tableName}_id_seq"', (SELECT MAX("${idField}") FROM "${tableName}"));`;

  return db.sequelize.query(sql);
}
