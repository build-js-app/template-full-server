export default {
  run
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
    default:
      console.log(`Unknown task "${task}".`);
  }
}
