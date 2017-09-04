import db from '../database/database';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
};

async function getRecords(userId, searchQuery) {
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

async function getRecordById(id) {
  let Record = db.models.Record;

  let record = await Record.findById(id);

  return mapRecord(record);
}

async function addRecord(userId, recordData) {
  let Record = db.models.Record;

  recordData.userId = userId;

  let record = await Record.create(recordData);

  return mapRecord(record);
}

async function updateRecord(recordData) {
  let Record = db.models.Record;

  let record = await Record.findOne({_id: recordData.id});

  if (!record) return;

  record.date = recordData.date;
  record.cost = recordData.cost;
  record.categoryId = recordData.categoryId;
  record.note = recordData.note;

  let result = await record.save();

  return mapRecord(result);
}

async function removeRecord(id) {
  let Record = db.models.Record;

  return await Record.remove({_id: id});
}

async function getRecordsByCategoryId(categoryId) {
  let Record = db.models.Record;

  let records = await Record.find({categoryId});

  return records.map(record => {
    return mapRecord(record);
  });
}

//helper methods

function mapRecord(record) {
  record._doc.id = record._id;

  return record;
}
