import db from '../database/database';

export default {
    getCategoryById,
    getCategories,
    addCategory,
    updateCategory,
    removeCategory
}

function getCategoryById(id) {
    let Category = db.models.Category;

    return Category.findById(id);
}

function getCategories(userId) {
    let Category = db.models.Category;

    let query = {
        userId: userId
    };

    return Category.find(query).sort({title: 1});
}

function addCategory(userId, category) {
    let Category = db.models.Category;

    category.userId = userId;

    return Category.create(category);
}

async function updateCategory(categoryData) {
    let Category = db.models.Category;

    let category = await Category.findOne({_id: categoryData._id});

    if (!category) return;

    category.title = categoryData.title;
    category.description = categoryData.description;

    return category.save();
}

function removeCategory(id) {
    let Category = db.models.Category;

    return Category.remove({_id: id});
}