const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        name: { type: String, maxLength: 255, required: true }, // default: '', minlength: 1
        description: { type: String, maxLength: 600 },
        image: { type: String, maxLength: 255 },
        level: { type: String, maxLength: 50 },
        videoId: { type: String, maxLength: 100, required: true },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        timestamps: true,
    },
);

// Custom query helper
CourseSchema.query.sortable = function(req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);

        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc',
        });
    } else {
        return this;
    }
}

mongoose.plugin(slug);
CourseSchema.plugin(mongooseDelete, { deletedAt : true, overrideMethods: 'all' });

module.exports = mongoose.model('Course', CourseSchema);
