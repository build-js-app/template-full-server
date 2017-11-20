import db from './database/database';
import seeder from './database/seeders/seederDefault';

async function run() {
  try {
    await db.init();
    seeder.seedData(db);
  } catch (err) {
    console.log(err);
  }
}

run();
