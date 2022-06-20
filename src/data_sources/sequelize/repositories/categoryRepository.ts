import * as _ from 'lodash';

import dbInit from '../database/database';
import { CategoryInstane } from '../typings/models/CategoryModel';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

const db = dbInit.init();
const categoryModel = db.models.Category;

async function getCategoryById(id: string): Promise<Category> {
  const category = await categoryModel.findByPk(id);

  return mapCategory(category);
}

async function getCategories(userId: string): Promise<Category[]> {
  const options = {
    where: {
      userId: userId
    }
  };

  const categories = await categoryModel.findAll(options);

  const result = _.sortBy(categories, 'title');

  return result.map(category => mapCategory(category));
}

async function addCategory(userId: string, categoryData): Promise<Category> {
  categoryData.userId = userId;

  const category = await categoryModel.create(categoryData);
  
  return mapCategory(category);
}

async function updateCategory(categoryData): Promise<Category> {
  const category = await categoryModel.findByPk(categoryData.id);

  if (!category) return;

  category.title = categoryData.title;
  category.description = categoryData.description;

  const result = await category.save();

  return mapCategory(result);
}

async function removeCategory(id: string): Promise<any> {
  const category = await categoryModel.findByPk(id);

  return await category.destroy();
}

//helper methods

function mapCategory(categoryModel: CategoryInstane): Category {
  const category: Category = {
    id: categoryModel.id.toString(),
    title: categoryModel.title,
    description: categoryModel.description,
    userId: categoryModel.userId.toString()
  };

  return category;
}