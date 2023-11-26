const mongoose = require('mongoose');
const crypto = require('crypto');

const constants = require('../utils/constants');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        max: 50,
    },
    lastname: {
        type: String,
        required: true,
        max: 50,
    },
    nic: {
        type: String,
        max: 12,
        min: 10,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    hash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.keys(constants.USER_ROLES),
        required: true,
    },
    status: {
        type: String,
        enum: Object.keys(constants.USER_STATUS),
        required: true,
        default: constants.USER_STATUS.ACTIVE,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {timestamps: true});

// eslint-disable-next-line func-names
userSchema.methods.setPassword = function (password) {
    this.hash = crypto.pbkdf2Sync(password, process.env.HASH_SALT, 1000, 64, 'sha512').toString('hex');
};

// eslint-disable-next-line func-names
userSchema.methods.validPassword = function (password) {
    return this.hash === crypto.pbkdf2Sync(password, process.env.HASH_SALT, 1000, 64, 'sha512').toString('hex');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
