import db from '../database/database';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

async function getCategoryById(id) {
  let Category = db.models.Category;

  let category = await Category.findById(id);

  return mapCategory(category);
}

async function getCategories(userId) {
  let Category = db.models.Category;

  let query = {
    userId
  };

  let categories = await Category.find(query).sort({title: 1});

  return categories.map(category => {
    return mapCategory(category);
  });
}

async function addCategory(userId, categoryData) {
  let Category = db.models.Category;

  categoryData.userId = userId;

  let category = await Category.create(categoryData);

  return mapCategory(category);
}

async function updateCategory(categoryData) {
  let Category = db.models.Category;

  let category = await Category.findOne({_id: categoryData.id});

  if (!category) return;

  category.title = categoryData.title;
  category.description = categoryData.description;

  let result = await category.save();

  return mapCategory(result);
}

async function removeCategory(id) {
  let Category = db.models.Category;

  return await Category.remove({_id: id});
}

//helper methods

function mapCategory(category) {
  category._doc.id = category._id;

  return category;
}
