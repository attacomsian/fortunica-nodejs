let mongoose = require('mongoose');
let Question = mongoose.model('Question');

const userQuestions = (req, res) => {
    Question.find({user: req.decode.id})
        .populate('client')
        .populate('answer')
        .sort({createdAt: -1})
        .exec((err, questions) => {
            if (err) {
                res.send(err);
            } else {
                res.json(questions);
            }
        });
};

const clientQuestions = (req, res) => {
    Question.find({client: req.decode.id})
        .populate('user')
        .populate('answer')
        .sort({createdAt: -1})
        .exec((err, questions) => {
            if (err) {
                res.send(err);
            } else {
                res.json(questions);
            }
        });
};

const saveQuestion = (req, res) => {
    if (req.body.content.length === 0) {
        res.status(400).json({
            message: 'All fields required'
        });
    } else {
        let question = new Question({
            content: req.body.content,
            client: req.body.client,
            user: req.decode.id
        });
        //save client into DB
        question.save((err, question) => {
            if (err) {
                res.send(err);
            } else {
                res.json({message: 'Question added.', question});
            }
        });
    }
};

const getQuestion = (req, res) => {
    Question.findById(req.params.id, (err, question) => {
        if (err) {
            res.send(err);
        } else {
            res.json(question);
        }
    });
};

//export all functions
module.exports = {userQuestions, clientQuestions, saveQuestion, getQuestion};