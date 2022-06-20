import * as _ from 'lodash';
import {map} from 'lodash';

import dbInit from '../database/database';

import {RecordInstance} from '../typings/models/RecordModel';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
} as RecordRepository;

const db = dbInit.init();
const recordModel = db.models.Record;

async function getRecords(userId: string, searchQuery: any): Promise<RecordDto[]> {
  const options = {
    where: {
      userId: userId
    }
  };

  const records = await recordModel.findAll(options);

  return _.sortBy(records, searchQuery.sortBy).map(category => mapRecord(category));
}

async function getRecordById(id: string): Promise<RecordDto> {
  const record = await recordModel.findByPk(id);

  return mapRecord(record);
}

async function addRecord(userId: string, recordData: Partial<RecordDto>) {
  recordData.userId = userId;

  const record = await recordModel.create(recordData);

  return mapRecord(record);
}

async function updateRecord(recordData: RecordDto): Promise<RecordDto> {
  const record = await recordModel.findByPk(recordData.id);

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId as any;
  record.note = recordData.note;

  const result = await record.save();

  return mapRecord(result);
}

async function removeRecord(id: string): Promise<void> {
  const record = await recordModel.findByPk(id);

  if (!record) return;

  return await record.destroy();
}

async function getRecordsByCategoryId(categoryId: string): Promise<RecordDto[]> {
  const options = {
    where: {
      categoryId: categoryId
    }
  };

  const result = await recordModel.findAll(options);

  return result.map(record => mapRecord(record));
}

//helper methods

function mapRecord(recordModel: RecordInstance): RecordDto {
  if (!recordModel) return null;

  const record: RecordDto = {
    id: recordModel.id.toString(),
    date: recordModel.date,
    cost: recordModel.cost,
    note: recordModel.note,
    categoryId: recordModel.categoryId.toString(),
    userId: recordModel.userId.toString()
  };

  return record;
}
