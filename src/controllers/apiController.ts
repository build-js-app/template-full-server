import * as Joi from 'joi';

import AppError from '../appError';
import helper from './_controllerHelper';
import userRepository from '../repositories/userRepository';
import categoryRepository from '../repositories/categoryRepository';
import recordRepository from '../repositories/recordRepository';

export default {
  getCurrentUser,
  categoriesList,
  saveCategory,
  deleteCategory,
  recordsList,
  saveRecord,
  deleteRecord
};

async function getCurrentUser(req, res) {
  try {
    let userId = helper.getCurrentUser(req).id;

    let user = await userRepository.getUserById(userId);

    return helper.sendData(user, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function categoriesList(req, res) {
  try {
    let userId = helper.getCurrentUser(req).id;

    let records = await categoryRepository.getCategories(userId);

    return helper.sendData(records, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function saveCategory(req, res) {
  try {
    let data = await helper.loadSchema(req.body, {
      category: Joi.object().keys({
        id: Joi.number().allow(null),
        title: Joi.string().required(),
        description: Joi.string().required()
      })
    });

    let userId = helper.getCurrentUser(req).id;

    let category = null;

    if (data.category.id) {
      await assertThatUserOwnsCategory(userId, data.category.id);

      category = await categoryRepository.updateCategory(data.category);
    } else {
      category = await categoryRepository.addCategory(userId, data.category);
    }

    return helper.sendData(category, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function deleteCategory(req, res) {
  try {
    let data = await helper.loadSchema(req.params, {
      id: Joi.string().required()
    });

    let userId = helper.getCurrentUser(req).id;

    await assertThatUserOwnsCategory(userId, data.id);

    await checkThatNoRecordsForCategory(data.id);

    await categoryRepository.removeCategory(data.id);

    return helper.sendData({}, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function recordsList(req, res) {
  try {
    let searchQuery = await helper.loadSchema(req.query, {
      sortBy: Joi.string().required()
    });

    let userId = helper.getCurrentUser(req).id;

    let records = await recordRepository.getRecords(userId, searchQuery);

    return helper.sendData(records, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function saveRecord(req, res) {
  try {
    let data = await helper.loadSchema(req.body, {
      record: Joi.object().keys({
        id: Joi.number().allow(null),
        date: Joi.date().required(),
        categoryId: Joi.number().required(),
        cost: Joi.number().required(),
        note: Joi.string().required()
      })
    });

    let userId = helper.getCurrentUser(req).id;

    let record = null;

    if (data.record.id) {
      await assertThatUserOwnsRecord(userId, data.record.id);

      record = await recordRepository.updateRecord(data.record);
    } else {
      record = await recordRepository.addRecord(userId, data.record);
    }

    return helper.sendData(record, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await helper.loadSchema(req.params, {
      id: Joi.number().required()
    });

    let userId = helper.getCurrentUser(req).id;

    await assertThatUserOwnsRecord(userId, data.id);

    await recordRepository.removeRecord(data.id);

    return helper.sendData({}, res);
  } catch (err) {
    return helper.sendFailureMessage(err, res);
  }
}

async function assertThatUserOwnsCategory(userId, categoryId) {
  let category = await categoryRepository.getCategoryById(categoryId);

  let hasRights = category && category.userId === userId;

  if (!hasRights) throw new AppError('User does not own category');
}

async function assertThatUserOwnsRecord(userId, recordId) {
  let record = await recordRepository.getRecordById(recordId);

  let hasRights = record && record.userId === userId;

  if (!hasRights) throw new AppError('User does not own record');
}

async function checkThatNoRecordsForCategory(categoryId) {
  let records = await recordRepository.getRecordsByCategoryId(categoryId);

  let hasRecords = records && records.length;

  if (hasRecords) throw new AppError('Cannot delete category with records');
}
