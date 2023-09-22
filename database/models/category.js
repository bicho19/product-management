const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isEnabled: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamp: true,
    versionKey: false,
});

CategorySchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = doc._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Category', CategorySchema);