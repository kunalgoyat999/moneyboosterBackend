const mongoose = require('mongoose');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: Number,
        },
        password: {
            type: String,
        },
        amounAdded: {
            type: Number
        },
        amountWithraw: {
            type: Number
        },
        amountToBeUse: {
            type: Number
        },
        accountNo: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        bankName: {
            type: String,
        }
    },
    { timestamps: true },
    { minimize: false }
);

module.exports = mongoose.model('User', UserSchema);