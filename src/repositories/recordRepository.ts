import * as Parse from 'parse/node';

export default {
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  removeRecord,
  getRecordsByCategoryId
};

async function getRecords(currentUser, searchQuery) {
  const query = new Parse.Query('Record');

  query.equalTo('userId', currentUser);
  query.ascending(searchQuery.sortBy);

  const records: Parse.Record[] = await query.find();

  return records.map(record => {
    return {
      id: record.id,
      date: record.get('date'),
      cost: record.get('cost'),
      note: record.get('note'),
      categoryId: record.get('categoryId')?.id,
      userId: currentUser.id
    };
  });
}

async function getRecordById(id) {
  const queryRecord = new Parse.Query('Record');
  return await queryRecord.get(id);
}

async function addRecord(recordData, category, currentUser) {
  const Record: Parse.Object = new Parse.Object('Record');
  Record.set('date', recordData.date);
  Record.set('cost', recordData.cost);
  Record.set('note', recordData.note);
  Record.set('categoryId', category);
  Record.set('userId', currentUser);

  return await Record.save();
}

async function updateRecord(recordData, category) {
  const Record: Parse.Object = new Parse.Object('Record');
  Record.set('objectId', recordData.id);
  Record.set('date', recordData.date);
  Record.set('cost', recordData.cost);
  Record.set('note', recordData.note);
  Record.set('categoryId', category);

  return await Record.save();
}

async function removeRecord(id) {
  const Record: Parse.Object = new Parse.Object('Record');
  Record.set('objectId', id);

  await Record.destroy();
}

async function getRecordsByCategoryId(categoryId) {
  /*let Record = db.models.Record;

  let records = await Record.find({categoryId});

  return records.map(record => {
    return mapRecord(record);
  });*/
}

//helper methods

function mapRecord(record) {
  record._doc.id = record._id;

  return record;
}
