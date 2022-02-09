import * as Joi from 'joi';
import * as Parse from 'parse/node';

import AppError from '../appError';
import helper from './_controllerHelper';
import categoryRepository from '../repositories/categoryRepository';
import recordRepository from '../repositories/recordRepository';

export default {
  currentUser,
  categoryList,
  saveCategory,
  deleteCategory,
  recordList,
  saveRecord,
  deleteRecord
};

async function currentUser(req, res) {
  try {
    const currentUser: Parse.User = await Parse.User.current();

    if (!currentUser) return helper.sendData(currentUser, res);

    const user = {
      email: currentUser.get('email'),
      profile: {
        local: {
          firstName: currentUser.get('firstName'),
          lastName: currentUser.get('lastName'),
          isActivated: true
        }
      }
    };

    return helper.sendData(user, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function categoryList(req, res) {
  try {
    const currentUser: Parse.User = await Parse.User.current();

    let categories = await categoryRepository.getCategories(currentUser);

    return helper.sendData(categories, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function saveCategory(req, res) {
  try {
    const data = await helper.loadSchema(req.body, {
      category: Joi.object()
        .unknown(true)
        .keys({
          id: Joi.string().allow(null),
          title: Joi.string().required(),
          description: Joi.string().required()
        })
    });

    const currentUser: Parse.User = await Parse.User.current();

    let category = null;

    if (data.category.id) {
      //await assertUserOwnsCategory(userId, data.category.id);

      category = await categoryRepository.updateCategory(data.category);
    } else {
      category = await categoryRepository.addCategory(data.category, currentUser);
    }

    return helper.sendData(category, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function deleteCategory(req, res) {
  try {
    const data = await helper.loadSchema(req.params, {
      id: Joi.string().required()
    });

    //await assertUserOwnsCategory(helper.getCurrentUser(req)._id, data.id);

    //await assertCategoryHasNoRecords(data.id);

    await categoryRepository.removeCategory(data.id);

    return helper.sendData({}, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function recordList(req, res) {
  try {
    const searchQuery = await helper.loadSchema(req.query, {
      sortBy: Joi.string().required()
    });

    const currentUser: Parse.User = await Parse.User.current();

    const records = await recordRepository.getRecords(currentUser, searchQuery);

    return helper.sendData(records, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function saveRecord(req, res) {
  try {
    const data = await helper.loadSchema(req.body, {
      record: Joi.object()
        .unknown(true)
        .keys({
          id: Joi.string().allow(null),
          date: Joi.date().required(),
          categoryId: Joi.string().required(),
          cost: Joi.number().required(),
          note: Joi.string().required()
        })
    });

    const currentUser: Parse.User = await Parse.User.current();
    const category = await categoryRepository.getCategoryById(data.record.categoryId);

    let record = null;

    if (data.record.id) {
      //await assertUserOwnsRecord(userId, data.record.id);

      record = await recordRepository.updateRecord(data.record, category);
    } else {
      record = await recordRepository.addRecord(data.record, category, currentUser);
    }

    return helper.sendData(record, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function deleteRecord(req, res) {
  try {
    const data = await helper.loadSchema(req.params, {
      id: Joi.string().required()
    });

    //await assertUserOwnsRecord(helper.getCurrentUser(req)._id, data.id);

    await recordRepository.removeRecord(data.id);

    return helper.sendData({}, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function assertUserOwnsCategory(userId, categoryId) {
  let category = await categoryRepository.getCategoryById(categoryId);

  let hasRights = category && category.userId.toString() === userId;

  if (!hasRights) throw new AppError('User does not own category');
}

async function assertUserOwnsRecord(userId, recordId) {
  let record = await recordRepository.getRecordById(recordId);

  let hasRights = record && record.userId.toString() === userId;

  if (!hasRights) throw new AppError('User does not own record');
}

async function assertCategoryHasNoRecords(categoryId) {
  /*let records = await recordRepository.getRecordsByCategoryId(categoryId);

  let hasRecords = records && records.length;

  if (hasRecords) throw new AppError('Cannot delete category with records.');*/
}
