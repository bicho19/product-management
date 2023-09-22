const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
        {
            _id: false, // Remove the added Mongo ID
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    status: {
        type: String,
        enum: ['unpaid', 'paid', 'shipped', 'cancelled'],
        default: 'unpaid',
    },
}, {
    timestamps: true,
    versionKey: false,
});

ProductSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = doc._id;
        delete ret._id;
    }
});


module.exports = mongoose.model('Purchase', ProductSchema);
