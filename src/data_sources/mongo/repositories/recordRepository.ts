import {Types} from 'joi';
import db from '../database/database';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
} as RecordRepository;

async function getRecords(userId: string, searchQuery: any): Promise<RecordDto[]> {
  let Record = db.models.Record;

  let query: any = {
    userId
  };

  let sort = {};

  sort[searchQuery.sortBy] = 1;

  let records = await Record.find(query).sort(sort);

  return records.map(record => {
    return mapRecord(record);
  });
}

async function getRecordById(id: string): Promise<RecordDto> {
  let Record = db.models.Record;

  let record = await Record.findById(id);

  return mapRecord(record);
}

async function addRecord(userId: string, recordData: Partial<RecordDto>) {
  let Record = db.models.Record;

  recordData.userId = userId;

  let record = await Record.create(recordData);

  return mapRecord(record);
}

async function updateRecord(recordData: RecordDto): Promise<RecordDto> {
  let Record = db.models.Record;

  let record = await Record.findOne({_id: recordData.id});

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId as any;
  record.note = recordData.note;

  let result = await record.save();

  return mapRecord(result);
}

async function removeRecord(id: string): Promise<void> {
  let Record = db.models.Record;

  await Record.deleteOne({_id: id});
}

async function getRecordsByCategoryId(categoryId: string): Promise<RecordDto[]> {
  let Record = db.models.Record;

  let records = await Record.find({categoryId});

  return records.map(record => {
    return mapRecord(record);
  });
}

//helper methods

function mapRecord(record: any): RecordDto {
  if (!record) return null;

  record._doc.id = record._id;

  return record as RecordDto;
}
