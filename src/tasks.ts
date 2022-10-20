import dataAccess from './data_access';

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
  await dataAccess.createDb();
}
