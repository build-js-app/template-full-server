import * as _ from 'lodash';

import dbInit from '../database/database';

export default {
  init,
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
};

const db = dbInit.init();
let recordModel = db.models.Record;

function init(db) {
  recordModel = db.models.Record;
}

async function getRecords(userId, searchQuery) {
  let options = {
    where: {
      userId: userId
    }
  };

  let records = await recordModel.findAll(options);

  return _.sortBy(records, searchQuery.sortBy);
}

async function getRecordById(id) {
  return await recordModel.findById(id);
}

async function addRecord(userId, record) {
  record.userId = userId;

  return await recordModel.create(record);
}

async function updateRecord(recordData) {
  let record = await recordModel.findById(recordData.id);

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId;
  record.note = recordData.note;

  return await record.save();
}

async function removeRecord(id) {
  let record = await recordModel.findById(id);

  if (!record) return;

  return await record.destroy();
}

async function getRecordsByCategoryId(categoryId) {
  let options = {
    where: {
      categoryId: categoryId
    }
  };

  return await recordModel.findAll(options);
}
