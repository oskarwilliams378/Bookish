const jwt = require('jsonwebtoken');

const UserModel = require('./models/userModel');

module.exports = (req, res, next) => {
    const token = req.query.token;
    if (token !== undefined) {
        let username = '';
        jwt.verify(token, 'secretsoftwireproject', { maxAge: 3600 }, (err, result) => {
            if (!err) {
                username = result.username;
            }
        });
    
        UserModel.accountExists(username).then(validUser => {
            if (validUser) {
                next();
            } else {
                res.send([]);
            }
        });} else {
        res.send([]);
    }

};