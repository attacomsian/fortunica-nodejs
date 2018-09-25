let mongoose = require('mongoose');
let User = mongoose.model('User');
let Client = mongoose.model('Client');

const subscribe = (req, res) => {
    if (req.body.type === 'client') {
        Client.findByIdAndUpdate(req.decoded.id,
            {$set: {pushToken: req.body.subscription}},
            (err, client) => {
                if (err) {
                    res.send(err);
                } else {
                    res.status(201).json({});
                }
            });
    } else {
        User.findByIdAndUpdate(req.decoded.id,
            {$set: {pushToken: req.body.subscription}},
            (err, user) => {
                if (err) {
                    res.send(err);
                } else {
                    res.status(201).json({});
                }
            });
    }
};

//export all functions
module.exports = {subscribe};