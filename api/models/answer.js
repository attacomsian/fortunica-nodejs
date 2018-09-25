let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// answer schema definition
const AnswerSchema = new Schema({
    content: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    question: {type: Schema.Types.ObjectId, ref: 'Question'},
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
AnswerSchema.pre('save', next => {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;
    next();
});

//Exports the AnswerSchema for use elsewhere.
module.exports = mongoose.model('Answer', AnswerSchema);