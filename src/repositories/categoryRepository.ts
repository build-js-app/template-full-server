import * as _ from 'lodash';

import database from '../database/database';

import {Category} from '../database/entities/category';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

async function getCategoryById(id) {
  const repository = await getRepository();

  return await repository.findOne(id);
}

async function getCategories(userId) {
  const options = {
    where: {
      userId: userId
    }
  };

  const repository = await getRepository();

  const categories = await repository.find(options);

  return _.sortBy(categories, 'title');
}

async function addCategory(userId, category) {
  category.userId = userId;

  const repository = await getRepository();

  return await repository.create(category);
}

async function updateCategory(categoryData) {
  const repository = await getRepository();

  const category = await repository.findOne(categoryData.id);

  if (!category) return;

  category.title = categoryData.title;
  category.description = categoryData.description;

  return await repository.save(category);
}

async function removeCategory(id) {
  const repository = await getRepository();

  const category = await repository.findOne(id);

  return await repository.remove(category);
}

//helper function

async function getRepository() {
  const connection = await database.connect();
  return connection.getRepository(Category);
}
