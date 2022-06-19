import * as mongoose from 'mongoose';

import seederDefault from '../data_sources/mongo/database/seeders/seederDefault';
import categoryRepository from '../data_sources/mongo/repositories/categoryRepository';
import userRepository from '../data_sources/mongo/repositories/userRepository';

const databaseName = 'test';
const testUserEmail = 'user_a@test.com';

let userId = '';

describe('Category repository', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`;
    const db = await mongoose.connect(url, {});

    await seederDefault.seedData(db);

    const user = await userRepository.getUserByEmail(testUserEmail);
    if (user) userId = user.id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should get list of all categories', async () => {
    const categories = await categoryRepository.getCategories(userId);
    expect(categories).toHaveLength(3);
  });
});
