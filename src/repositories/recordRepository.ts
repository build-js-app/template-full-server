import db from '../database/database';

export default {
    getRecords,
    getRecordById,
    addRecord,
    updateRecord,
    removeRecord,
    getRecordsByCategoryId
};

function getRecords(userId, searchQuery) {
    let Record = db.models.Record;

    let query: any = {
        userId
    };

    let sort = {};

    sort[searchQuery.sortBy] = 1;

    return Record.find(query).sort(sort);
}

function getRecordById(id) {
    let Record = db.models.Record;

    return Record.findById(id);
}

function addRecord(userId, record) {
    let Record = db.models.Record;

    record.userId = userId;

    return Record.create(record);
}

async function updateRecord(recordData) {
    let Record = db.models.Record;

    let record = await Record.findOne({_id: recordData._id});

    if (!record) return;

    record.date = recordData.date;
    record.cost = recordData.cost;
    record.categoryId = recordData.categoryId;
    record.note = recordData.note;

    return record.save();
}

function removeRecord(id) {
    let Record = db.models.Record;

    return Record.remove({_id: id});
}

function getRecordsByCategoryId(categoryId) {
    let Record = db.models.Record;

    return Record.find({categoryId});
}