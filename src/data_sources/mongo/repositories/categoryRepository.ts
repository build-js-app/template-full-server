import db from '../database/database';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

async function getCategoryById(id: string): Promise<Category> {
  const CategoryModel = db.models.Category;

  const category = await CategoryModel.findById(id);

  return mapCategory(category);
}

async function getCategories(userId: string): Promise<Category[]> {
  const CategoryModel = db.models.Category;

  const query = {
    userId
  };

  const categories = await CategoryModel.find(query).sort({title: 1});

  return categories.map(category => {
    return mapCategory(category);
  });
}

async function addCategory(userId: string, categoryData): Promise<Category> {
  const CategoryModel = db.models.Category;

  categoryData.userId = userId;

  const category = await CategoryModel.create(categoryData);

  return mapCategory(category);
}

async function updateCategory(categoryData): Promise<Category> {
  const CategoryModel = db.models.Category;

  const category = await CategoryModel.findOne({_id: categoryData.id});

  if (!category) return;

  category.title = categoryData.title;
  category.description = categoryData.description;

  const result = await category.save();

  return mapCategory(result);
}

async function removeCategory(id: string): Promise<any> {
  const CategoryModel = db.models.Category;

  return await CategoryModel.deleteOne({_id: id});
}

//helper methods

function mapCategory(categoryModel): Category {
  const category: Category = {
    id: categoryModel._id.valueOf(),
    title: categoryModel.title,
    description: categoryModel.description,
    userId: categoryModel.userId.valueOf()
  };

  return category;
}
