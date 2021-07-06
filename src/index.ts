//Enable absolute imports
if (process.env.NODE_ENV !== 'production') {
  require('app-module-path').addPath(__dirname);
}

process.on('uncaughtException', err => {
  const stack = err.stack;
  console.log(`Uncaught exception. ${err}`);
  if (err['code'] === 'EADDRINUSE') {
    console.error(`Port ${err['port']} is already in use.`);
  }
});

import server from './server';
import config from './config';
import logger from './logger';
import tasks from './tasks';

async function start() {
  if (config.db.seedOnStart) {
    await tasks.seed();
  }

  const port = await server.start(process.env.PORT || config.port);

  console.log(`Server is listening on port ${port}!`);

  logger.info(`Server started.`);
}

const run = async () => {
  const args = process.argv;

  //run task
  if (args[2] === 'run') {
    await tasks.run(args[3]);
    process.exit(0);
    //run server
  } else {
    await start();
  }
};

run();
