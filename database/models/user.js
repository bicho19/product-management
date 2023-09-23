const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
    versionKey: false,
});

// pre-save the document hash the password
UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password'))
        return next();

    // Hash the user password
    user.password = await bcrypt.hash(user.password, 12);

    next();
});

// Change the doc to return id and remove password field
UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('User', UserSchema);
