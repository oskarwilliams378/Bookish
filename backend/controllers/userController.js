const express = require('express');
const UserModel = require('../models/userModel');
const path = require('path');
const jwt = require('jsonwebtoken');

class UserController {
    constructor() {
        this.router = express.Router();
        this.router.get('/logout', this.getLogOut);
        this.router.route('/login').get(this.getLogIn).post(this.postLogIn);
        this.router.route('/signup').get(this.getSignUp).post(this.postSignUp);
    }

    getLogIn(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));// eslint-disable-line no-undef
    }

    postLogIn(req, res) {
        UserModel.verifyLogin(req.body)
            .then(valid => {
                if (valid) {
                    const token = jwt.sign({ username: req.body.username }, 'secretsoftwireproject');
                    res.cookie('Authentication_Token', token);
                    res.redirect('/book');
                }
            });
    }

    getSignUp(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'signup.html'));// eslint-disable-line no-undef
    }

    postSignUp(req, res) {
        const user = new UserModel(req.body);
        user.createUser().then(() => res.redirect('/user/login'));
    }

    getLogOut(req, res) {
        res.clearCookie('Authentication_Token');
        res.redirect('/user/login');
    }

}

module.exports = new UserController().router;