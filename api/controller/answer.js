let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Answer = mongoose.model('Answer');

const userAnswers = (req, res) => {
    Answer.find({user: req.decode.id})
        .populate('question')
        .sort({createdAt: -1})
        .exec((err, answers) => {
            if (err) {
                res.send(err);
            } else {
                res.json(answers);
            }
        });
};

const saveAnswer = (req, res) => {
    if (req.body.content.length === 0) {
        res.status(400).json({
            message: 'All fields required'
        });
    } else {
        let answer = new Answer({
            content: req.body.content,
            question: req.body.question,
            user: req.decode.id,
        });
        //save answer into DB
        answer.save((err, answer) => {
            if (err) {
                res.send(err);
            } else {
                //update parent question here
                Question.findByIdAndUpdate(req.body.question,
                    {$set: {answer: answer._id}}, function (err, question) {
                        //TODO: info user?
                    });
                res.json({message: 'Answer added.', question: answer});
            }
        });
    }
};

const getAnswer = (req, res) => {
    Answer.findById(req.params.id, (err, answer) => {
        if (err) {
            res.send(err);
        } else {
            res.json(answer);
        }
    });
};

//export all functions
module.exports = {userAnswers, saveAnswer, getAnswer};