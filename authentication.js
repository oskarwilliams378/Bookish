const jwt = require('jsonwebtoken');

const UserModel = require('./models/userModel');

module.exports = (req, res, next) => {
    let username = '';
    const token = req.headers.cookie
        .split('; ')
        .map(cookie => cookie.split('='))
        .find(cookie => cookie[0] === 'Authentication_Token');
    if (token) {
        jwt.verify(token[1], 'secretsoftwireproject', { maxAge: 3600 }, (err, result) => {
            if (!err) {
                username = result.username;
            }
        });
    }
    UserModel.accountExists(username).then(validUser => {
        if (validUser) {
            next();
        } else {
            res.redirect('/user/login');
        }
    });
};