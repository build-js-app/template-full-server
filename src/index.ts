process.on('uncaughtException', err => {
  let stack = err.stack;
  console.log(`Uncaught exception. ${err}`);
});

import server from './server';
import config from './config';
import logger from './logger';
import tasks from './tasks';

async function start() {
  if (config.db.seedOnStart) {
    await tasks.seed();
  }

  let port = await server.start(process.env.PORT || config.port);

  console.log(`Server is listening on port ${port}!`);

  logger.info(`Server started.`);
}

let args = process.argv;

//run task
if (args[2] === 'run') {
  tasks.run(args[3]);
  //run server
} else {
  start();
}
