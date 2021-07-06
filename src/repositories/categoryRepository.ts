import * as _ from 'lodash';

import dbInit from '../database/database';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

const db = dbInit.init();
const categoryModel = db.models.Category;

async function getCategoryById(id) {
  return await categoryModel.findByPk(id);
}

async function getCategories(userId) {
  const options = {
    where: {
      userId: userId
    }
  };

  const categories = await categoryModel.findAll(options);

  return _.sortBy(categories, 'title');
}

async function addCategory(userId, category) {
  category.userId = userId;

  return await categoryModel.create(category);
}

async function updateCategory(categoryData) {
  const category = await categoryModel.findByPk(categoryData.id);

  if (!category) return;

  category.title = categoryData.title;
  category.description = categoryData.description;

  return await category.save();
}

async function removeCategory(id) {
  const category = await categoryModel.findByPk(id);

  return await category.destroy();
}
