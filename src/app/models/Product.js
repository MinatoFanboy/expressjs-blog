const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    allowState: Boolean,
    barCode: String,
    categoryId: Number,
    categoryId2: Number,
    categoryName: String,
    createdDate: Date,
    code: String,
    conversionValue: Number,
    fullName: String,
    hasVariants: Boolean,
    id: Number,
    isActive: Boolean,
    isLotSerialControl: Boolean,
    modifiedDate: Date,
    name: String,
    retailerId: Number,
    type: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
