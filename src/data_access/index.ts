import config from '../config';

import categoryRepositoryMongo from 'data_sources/mongo/repositories/categoryRepository';
import recordRepositoryMongo from 'data_sources/mongo/repositories/recordRepository';
import userRepositoryMongo from 'data_sources/mongo/repositories/userRepository';
import databaseMongo from 'data_sources/mongo/database/database';

import categoryRepositorySequelize from 'data_sources/sequelize/repositories/categoryRepository';
import recordRepositorySequelize from 'data_sources/sequelize/repositories/recordRepository';
import userRepositorySequelize from 'data_sources/sequelize/repositories/userRepository';
import databaseSequelize from 'data_sources/sequelize/database/database';

const mongoDataSource = {
  categoryRepository: categoryRepositoryMongo,
  recordRepository: recordRepositoryMongo,
  userRepository: userRepositoryMongo,
  dataSource: {
    connect: databaseMongo.init
  }
};

const sequelizeDataSource = {
  categoryRepository: categoryRepositorySequelize,
  recordRepository: recordRepositorySequelize,
  userRepository: userRepositorySequelize,
  dataSource: {
    connect: databaseSequelize.init
  }
};

const dataSource = config.dataAccess.dataSource === 'mongo' ? mongoDataSource : sequelizeDataSource;

export const categoryRepository = dataSource.categoryRepository;
export const recordRepository = dataSource.recordRepository;
export const userRepository = dataSource.userRepository;

export default mongoDataSource.dataSource;
