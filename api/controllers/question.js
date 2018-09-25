let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let User = mongoose.model('User');

const webpush = require('../integrations/web-push/web-push');

const userQuestions = (req, res) => {
    Question.find({user: req.decoded.id})
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
    Question.find({client: req.decoded.id})
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
            user: req.body.user,
            client: req.decoded.id
        });
        //save client.js into DB
        question.save((err, question) => {
            if (err) {
                res.send(err);
            } else {
                //send web push notification
                User.findById(req.body.user, (err, user) => {
                    if (!err && user.pushToken && user.pushToken.length !== 0) {
                        webpush.sendNotification(user.pushToken, req.decoded.name + ' asked a new question.', req.body.content);
                    }
                    res.json({message: 'Question added.', question});
                });
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