import * as _ from 'lodash';

import db from './database';
import seeder from './seeders/seederDefault';
import config from '../config';
import {error} from 'util';

export default {
  createDb
};

async function createDb() {
  try {
    await db.init();

    await seeder.seedData(db);

    console.log('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.log(`Check DB config values. Create DB if not exists.`);
    console.log(`Error: ${err}`);
  }
}
