const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamp: true,
    versionKey: false,
});

ProductSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = doc._id;
        delete ret._id;
    }
});


module.exports = mongoose.model('Product', ProductSchema);
