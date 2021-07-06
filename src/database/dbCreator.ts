import dbInit from './database';
import seeder from './seeders/seederDev';

export default {
  createDb
};

async function createDb() {
  try {
    console.log('DB was seeded!');
  } catch (err) {
    console.error(`Data Seed error`);
    console.log(`Check DB config values. Create DB if not exists.`);
    console.log(`Error: ${err}`);
  }
}
