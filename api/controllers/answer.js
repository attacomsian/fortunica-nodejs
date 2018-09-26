let mongoose = require('mongoose');
let Question = mongoose.model('Question');
let Answer = mongoose.model('Answer');
let Client = mongoose.model('Client');

const webpush = require('../integrations/web-push/web-push');

const userAnswers = (req, res) => {
    Answer.find({user: req.decoded.id})
        .populate('question')
        .populate('client')
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
            user: req.decoded.id,
        });
        //save answer into DB
        answer.save((err, answer) => {
            if (err) {
                res.send(err);
            } else {
                //update parent question here
                Question.findOneAndUpdate({_id: req.body.question},
                    {$set: {answer: answer._id}}, (err, question) => {
                        if (!err) {
                            //send web push notification
                            Client.findById(question.client, (err, client) => {
                                if (!err && client.pushToken) {
                                  webpush.sendNotification(client.pushToken, req.decoded.name + ' replied to your question.', req.body.content);
                                }
                                res.json({message: 'Answer added.', answer});
                            });
                        } else {
                            res.json({message: 'Answer added.', answer});
                        }
                    });
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
