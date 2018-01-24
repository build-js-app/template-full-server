import * as dateFns from 'date-fns';
import * as bcrypt from 'bcrypt-nodejs';
import * as fs from 'fs-extra';

import path from '../../helpers/pathHelper';

export default {
  seedData
};

async function seedData(db) {
  let seedPath = path.getDataRelative('seed/seedData.json');
  let seedData = await fs.readJson(seedPath);

  await seedUsers(db, seedData.users);
  await seedCategories(db, seedData.categories);
  await seedRecords(db, seedData.records);
}

async function seedUsers(db, usersData) {
  for (let user of usersData) {
    let localProfile = user.profile.local;
    localProfile.password = bcrypt.hashSync(localProfile.password, bcrypt.genSaltSync(8), null);
    await db.models.User.create(user);
  }
}

async function seedCategories(db, categoryData) {
  for (let category of categoryData) {
    await db.models.Category.create(category);
  }
}

async function seedRecords(db, recordsData) {
  for (let record of recordsData) {
    record.date = dateFns.parse(record.date);

    await db.models.Record.create(record);
  }
}
