import * as _ from 'lodash';

import dbInit from '../database/database';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
};

const db = dbInit.init();
const recordModel = db.models.Record;

async function getRecords(userId, searchQuery) {
  const options = {
    where: {
      userId: userId
    }
  };

  const records = await recordModel.findAll(options);

  return _.sortBy(records, searchQuery.sortBy);
}

async function getRecordById(id) {
  return await recordModel.findByPk(id);
}

async function addRecord(userId, record) {
  record.userId = userId;

  return await recordModel.create(record);
}

async function updateRecord(recordData) {
  const record = await recordModel.findByPk(recordData.id);

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId;
  record.note = recordData.note;

  return await record.save();
}

async function removeRecord(id) {
  const record = await recordModel.findByPk(id);

  if (!record) return;

  return await record.destroy();
}

async function getRecordsByCategoryId(categoryId) {
  const options = {
    where: {
      categoryId: categoryId
    }
  };

  return await recordModel.findAll(options);
}
