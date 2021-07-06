import * as _ from 'lodash';

import database from '../database/database';

import {Record} from '../database/entities/record';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
};

async function getRecords(userId, searchQuery) {
  const options = {
    where: {
      userId: userId
    }
  };

  const repository = await getRepository();

  const records = await repository.find(options);

  return _.sortBy(records, searchQuery.sortBy);
}

async function getRecordById(id) {
  const repository = await getRepository();

  return await repository.findOne(id);
}

async function addRecord(userId, record) {
  const repository = await getRepository();

  record.userId = userId;

  return await repository.save(record);
}

async function updateRecord(recordData) {
  const repository = await getRepository();

  const record = await repository.findOne(recordData.id);

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.category = recordData.categoryId;
  record.note = recordData.note;

  return await repository.save(record);
}

async function removeRecord(id) {
  const repository = await getRepository();

  const record = await repository.findOne(id);

  if (!record) return;

  return await repository.remove(record);
}

async function getRecordsByCategoryId(categoryId) {
  const options = {
    where: {
      categoryId: categoryId
    }
  };

  const repository = await getRepository();

  return await repository.find(options);
}

//helper function

async function getRepository() {
  const connection = await database.connect();
  return connection.getRepository(Record);
}
