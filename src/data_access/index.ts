import categoryRepositoryMongo from '../data_sources/mongo/repositories/categoryRepository';
import recordRepositoryMongo from '../data_sources/mongo/repositories/recordRepository';
import userRepositoryMongo from '../data_sources/mongo/repositories/userRepository';

import databaseMongo from '../data_sources/mongo/database/database';

const mongoDataSource = {
  categoryRepository: categoryRepositoryMongo,
  recordRepository: recordRepositoryMongo,
  userRepository: userRepositoryMongo,
  dataSource: {
    connect: databaseMongo.init
  }
};

export const categoryRepository = mongoDataSource.categoryRepository;
export const recordRepository = mongoDataSource.recordRepository;
export const userRepository = mongoDataSource.userRepository;

export default mongoDataSource.dataSource;
