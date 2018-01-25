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

  let userLookup = await seedUsers(db, seedData.users);
  let categoryLookup = await seedCategories(db, seedData.categories, userLookup);
  await seedRecords(db, seedData.records, userLookup, categoryLookup);
}

async function seedUsers(db, usersData) {
  let userLookup = {};

  let User = db.models.User;

  await User.remove();

  for (let user of usersData) {
    let localProfile = user.profile.local;

    localProfile.password = bcrypt.hashSync(localProfile.password, bcrypt.genSaltSync(8), null);

    let userModel = await User.create(user);

    userLookup[user.id] = userModel._id;
  }

  return userLookup;
}

async function seedCategories(db, categoryData, userLookup) {
  let categoryLookup = {};

  let Category = db.models.Category;

  await Category.remove();

  for (let category of categoryData) {
    category.userId = userLookup[category.userId];

    let categoryModel = await Category.create(category);

    categoryLookup[category.id] = categoryModel._id;
  }

  return categoryLookup;
}

async function seedRecords(db, recordsData, userLookup, categoryLookup) {
  let Record = db.models.Record;

  await Record.remove();

  for (let record of recordsData) {
    record.date = dateFns.parse(record.date);
    record.userId = userLookup[record.userId];
    record.categoryId = categoryLookup[record.categoryId];

    await Record.create(record);
  }
}
