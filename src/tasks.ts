import dbInit from './database/database';
const db = dbInit.init();

import seeder from './database/seeders/seederDefault';

export default {
  run,
  seed
};

const tasks = [{name: 'seed', description: 'Seeds DB with initial data.'}];

async function run(task) {
  if (!task) {
    return console.log('Please, specify task to run.');
  }

  switch (task) {
    case 'list':
      console.log(tasks);
      break;
    case 'seed':
      await seed();
      break;
    default:
      console.log(`Unknown task "${task}".`);
  }
}

async function seed() {
  try {
    await db.sequelize.sync({force: true});

    await seeder.seedData(db);
  } catch (err) {
    console.error(`Data Seed error`);
    console.log(`Check DB config values. Create DB manually if it does not exist.`);
    console.log(`Error: ${err}`);
  }
}
