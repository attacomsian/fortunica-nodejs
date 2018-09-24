const bcrypt = require('bcrypt-nodejs');

//generate password hash
const hash = (password) => {
    return bcrypt.hashSync(password);
};

//match password with hashed version
const match = (rawPassword, password) => {
    return bcrypt.compareSync(rawPassword, password);
};

//export all functions
module.exports = {hash, match};
