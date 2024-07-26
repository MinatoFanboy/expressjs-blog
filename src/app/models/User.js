const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], trim: true, type: String },
    name: { maxLength: 255, minLength: 2, trim: true, type: String },
    password: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
