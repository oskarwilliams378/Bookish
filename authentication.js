const jwt = require('jsonwebtoken');

const User = require('./models/user');

module.exports = (req, res, next) => {
    let username = '';
    const token = req.headers.cookie
        .split('; ')
        .map(cookie => cookie.split('='))
        .find(cookie => cookie[0] === 'Authentication_Token');
    if (token) {
        jwt.verify(token[1], 'secretsoftwireproject', { maxAge: 60 }, (err, result) => {
            if (!err) {
                username = result.username;
            }
        });
    }
    User.checkName(username).then(validUser => {
        if (validUser) {
            next();
        } else {
            res.redirect('/login');
        }
    });
};