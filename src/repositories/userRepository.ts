import db from '../database/database';

export default {
    getUserByEmail,
    getUserById,
    addUser,
    getUsers,
    updateUser,
    removeUser
}

async function getUserByEmail(email) {
    let User = db.models.User;

    return User.findOne({email});
}

async function getUserById(id) {
    let User = db.models.User;

    return User.findById(id);
}

function addUser(userData) {
    let User = db.models.User;

    let user = new User();

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email.toLowerCase();
    user.password = user.generateHash(userData.password);
    user.role = 'user';

    return User.create(user);
}

function getUsers() {
    let User = db.models.User;

    return User.find();
}

async function updateUser(userData) {
    let user = await getUserByEmail(userData.email.toLowerCase());

    if (!user) return;

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;

    return user.save();
}

function removeUser(id) {
    let User = db.models.User;

    return User.remove({_id: id});
}