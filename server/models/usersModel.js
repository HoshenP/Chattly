const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    "email": {type: String, required: [true, "Email is required"], unique: true},
    "password": {type: String, required: [true, "Password is required"]},
    "firstName": {type: String, required: false},
    "lastName": {type: String, required: false},
    "gender": {type: String, required: false},
    "profileSetup": {type: Boolean, default: false}
}, {
    versionKey: false
});

const UserModel = mongoose.model('user', UsersSchema, 'users');

module.exports = UserModel;

