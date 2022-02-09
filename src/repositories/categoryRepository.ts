import * as Parse from 'parse/node';

export default {
  getCategoryById,
  getCategories,
  addCategory,
  updateCategory,
  removeCategory
};

async function getCategoryById(id) {
  const queryCategory = new Parse.Query('Category');
  return await queryCategory.get(id);
}

async function getCategories(currentUser) {
  const query = new Parse.Query('Category');

  query.equalTo('userId', currentUser);

  const categories: Parse.Category[] = await query.find();

  return categories.map(category => {
    return {
      id: category.id,
      title: category.get('title'),
      description: category.get('description'),
      userId: currentUser.id
    };
  });
}

async function addCategory(categoryData, currentUser) {
  const Category: Parse.Object = new Parse.Object('Category');
  Category.set('title', categoryData.title);
  Category.set('description', categoryData.description);
  Category.set('userId', currentUser);

  return await Category.save();
}

async function updateCategory(categoryData) {
  const Category: Parse.Object = new Parse.Object('Category');
  Category.set('objectId', categoryData.id);
  Category.set('title', categoryData.title);
  Category.set('description', categoryData.description);

  return await Category.save();
}

async function removeCategory(id) {
  const Category: Parse.Object = new Parse.Object('Category');
  Category.set('objectId', id);

  await Category.destroy();
}
