const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const AdminSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamp: true,
    versionKey: false,
});

// pre-save the document hash the password
AdminSchema.pre('save', async function (next) {
    const admin = this;

    if (!admin.isModified('password'))
        return next();

    // Hash the admin password
    admin.password = await bcrypt.hash(admin.password, 12);

    next();
});

// Change the doc to return id and remove password field
AdminSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
