let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// user schema definition
const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pushToken: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// set the createdAt and updatedAt parameters equal to the current time
UserSchema.pre('save', next => {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;
    next();
});

//Exports the UserSchema for use elsewhere.
module.exports = mongoose.model('User', UserSchema);