import 'reflect-metadata';
import {Connection, createConnection} from 'typeorm';
import {Category} from './entities/category';
import {Record} from './entities/record';
import {User} from './entities/user';

import config from '../config';

export default {
  connect
};

let connection = null;

async function connect(): Promise<Connection> {
  if (connection) return connection;

  try {
    connection = await createConnection({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: [Category, Record, User],
      synchronize: true,
      logging: false
    });

    return connection;
  } catch (err) {
    console.log('Cannot connect to database');
    console.log(err);
  }
}
