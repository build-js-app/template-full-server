import config from '../config';

import categoryRepositoryMongo from 'data_sources/mongo/repositories/categoryRepository';
import recordRepositoryMongo from 'data_sources/mongo/repositories/recordRepository';
import userRepositoryMongo from 'data_sources/mongo/repositories/userRepository';
import databaseMongo from 'data_sources/mongo/database/database';
import dbCreatorMongo from 'data_sources/mongo/database/dbCreator';

import categoryRepositorySequelize from 'data_sources/sequelize/repositories/categoryRepository';
import recordRepositorySequelize from 'data_sources/sequelize/repositories/recordRepository';
import userRepositorySequelize from 'data_sources/sequelize/repositories/userRepository';
import databaseSequelize from 'data_sources/sequelize/database/database';
import dbCreatorSequelize from 'data_sources/sequelize/database/dbCreator';

const mongoDataSource = {
  categoryRepository: categoryRepositoryMongo,
  recordRepository: recordRepositoryMongo,
  userRepository: userRepositoryMongo,
  connect: databaseMongo.init,
  dbCreator: dbCreatorMongo
};

const sequelizeDataSource = {
  categoryRepository: categoryRepositorySequelize,
  recordRepository: recordRepositorySequelize,
  userRepository: userRepositorySequelize,
  connect: databaseSequelize.init,
  dbCreator: dbCreatorSequelize
};

const dataSource = config.dataAccess.dataSource === 'mongo' ? mongoDataSource : sequelizeDataSource;

export const categoryRepository = dataSource.categoryRepository;
export const recordRepository = dataSource.recordRepository;
export const userRepository = dataSource.userRepository;

export default dataSource;
