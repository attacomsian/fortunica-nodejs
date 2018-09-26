const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        return res.status(403).json({
            message: 'No token provided.'
        });
    }
};
