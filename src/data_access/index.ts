import categoryRepositoryMongo from 'data_sources/mongo/repositories/categoryRepository';
import recordRepositoryMongo from 'data_sources/mongo/repositories/recordRepository';
import userRepositoryMongo from 'data_sources/mongo/repositories/userRepository';

const mongoRepositories = {
  categoryRepository: categoryRepositoryMongo,
  recordRepository: recordRepositoryMongo,
  userRepository: userRepositoryMongo
};

export const categoryRepository = mongoRepositories.categoryRepository;
export const recordRepository = mongoRepositories.recordRepository;
export const userRepository = mongoRepositories.userRepository;
