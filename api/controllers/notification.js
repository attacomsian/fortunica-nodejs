let mongoose = require('mongoose');
let User = mongoose.model('User');
let Client = mongoose.model('Client');

const webpush = require('../integrations/web-push/web-push');

const subscribe = (req, res) => {
    if (req.body.type === 'client') {
        Client.findOneAndUpdate({_id: req.decoded.id},
            {$set: {pushToken: req.body.subscription}},
            (err, client) => {
                if (err) {
                    res.send(err);
                } else {
                    //send confirmation notification
                    webpush.sendNotification(req.body.subscription, "Success!", "You subscribed to push notifications.");
                    //return response
                    res.status(201).json({});
                }
            });
    } else {
        User.findOneAndUpdate({_id: req.decoded.id},
            {$set: {pushToken: req.body.subscription}},
            (err, user) => {
                if (err) {
                    res.send(err);
                } else {
                    //send confirmation notification
                    webpush.sendNotification(req.body.subscription, "Success!", "You subscribed to push notifications.");
                    //return response
                    res.status(201).json({});
                }
            });
    }
};

//export all functions
module.exports = {subscribe};