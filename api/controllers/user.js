let mongoose = require('mongoose');
let User = mongoose.model('User');
let jwt = require('jsonwebtoken');

const config = require('../../config');
const encryptPassword = require('../middleware/encrypt-password');

const list = (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
};

const signup = (req, res) => {
    if (req.body.email.length === 0 || req.body.password.length === 0) {
        res.status(400).json({
            message: 'All fields required'
        });
    } else {
        let user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: encryptPassword.hash(req.body.password),
        });
        //save user into DB
        user.save((err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.json({message: 'User added.', user});
            }
        });
    }
};

const login = (req, res) => {
    User.findOne({email: req.body.email.toLowerCase()},
        (err, user) => {
            if (err) {
                res.send(err);
            } else {
                if (!user) {
                    res.status(401).json({message: 'User does not exist.'});
                } else {
                    // check if password matches
                    if (!encryptPassword.match(req.body.password, user.password)) {
                        res.status(401).json({message: 'Password does not match.'});
                    } else {
                        // if user is found and password is right - create a token
                        const token = jwt.sign({id: user._id, name: user.name}, config.secret, {
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
module.exports = {list, signup, login};