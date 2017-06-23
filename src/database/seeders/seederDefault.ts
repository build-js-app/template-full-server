import * as _ from 'lodash';
import * as dateFns from 'date-fns';
import path from '../../helpers/pathHelper';

export default {
    seedData
};

async function seedData(db) {
    let seedPath = path.getDataRelative('seed/seedData.json');
    let seedData = require(seedPath);

    await seedUsers(db, seedData.users);
    await seedCategories(db, seedData.categories);
    await seedRecords(db, seedData.records);

    await postImportRoutine(db);

    console.log('DB was seeded!');
}

async function seedUsers(db, usersData) {
    return await usersData.map(user => {
        return db.models.User.create(user);
    });
}

async function seedCategories(db, categoryData) {
    return await categoryData.map(category => {
        return db.models.Category.create(category);
    });
}

async function seedRecords(db, recordsData) {
    return await recordsData.map(record => {
        record.date = dateFns.parse(record.date);

        return db.models.Record.create(record);
    });
}

async function postImportRoutine(db) {
    if (db.sequelize.dialect.name === 'postgres') {
        return await _.toArray(db.models).map(model => {
            return updatePostgresSequence(model, db);
        });
    }

    return Promise.resolve(null);
}

function updatePostgresSequence(model, db) {
    let tableName = model.tableName;
    let idField = model.autoIncrementField;
    let sql = `SELECT setval('${tableName}_id_seq', (SELECT MAX(${idField}) FROM ${tableName}));`;

    return db.sequelize.query(sql);
}
