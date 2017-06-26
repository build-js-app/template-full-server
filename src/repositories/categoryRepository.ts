import * as _ from 'lodash';

import dbInit from '../database/database';

export default {
    init,
    getCategoryById,
    getCategories,
    addCategory,
    updateCategory,
    removeCategory
}

const db = dbInit.init();
let categoryModel = db.models.Category;

function init(db) {
    categoryModel = db.models.Category;
}

async function getCategoryById(id) {
    return await categoryModel.findById(id);
}

async function getCategories(userId) {
    let options = {
        where: {
            userId: userId
        }
    };

    let categories = await categoryModel.findAll(options);

    return _.sortBy(categories, 'title');
}

async function addCategory(userId, category) {
    category.userId = userId;

    return await categoryModel.create(category);
}

async function updateCategory(categoryData) {
    let category = await categoryModel.findById(categoryData.id);

    if (!category) return;

    category.title = categoryData.title;
    category.description = categoryData.description;

    return await category.save();
}

async function removeCategory(id) {
    let category = await categoryModel.findById(id);

    return await category.destroy();
}