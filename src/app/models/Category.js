const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    id: Number,
    name: String,
});

module.exports = mongoose.model('Category', CategorySchema);
