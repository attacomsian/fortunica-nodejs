let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// question schema definition
const QuestionSchema = new Schema({
    content: String,
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    answer: {type: Schema.Types.ObjectId, ref: 'Answer'},
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
QuestionSchema.pre('save', next => {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;
    next();
});

//Exports the QuestionSchema for use elsewhere.
module.exports = mongoose.model('Question', QuestionSchema);