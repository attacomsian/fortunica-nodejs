let mongoose = require('mongoose');
let Client = mongoose.model('Client');
let jwt = require('jsonwebtoken');

const config = require('../../config');
const encryptPassword = require('../middleware/encrypt-password');

const signup = (req, res) => {
    if (req.body.email.length === 0 || req.body.password.length === 0) {
        res.status(400).json({
            message: 'All fields required'
        });
    } else {
        let client = new Client({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: encryptPassword.hash(req.body.password),
        });
        //save client.js into DB
        client.save((err, client) => {
            if (err) {
                res.send(err);
            } else {
                res.json({message: 'Client added.', client});
            }
        });
    }
};

const login = (req, res) => {
    Client.findOne({email: req.body.email.toLowerCase()},
        (err, client) => {
            if (err) {
                res.send(err);
            } else {
                if (!client) {
                    res.status(401).json({message: 'Client does not exist.'});
                } else {
                    // check if password matches
                    if (!encryptPassword.match(req.body.password, client.password)) {
                        res.status(401).json({message: 'Password does not match.'});
                    } else {
                        // if user is found and password is right - create a token
                        const token = jwt.sign({id: client._id, name: client.name, type: 'client'}, config.secret, {
                            // expires in 30 days
                            expiresIn: 30 * 24 * 60 * 60
                        });
                        res.json({token: token});
                    }
                }
            }
        });
};

//export all functions
module.exports = {signup, login};
