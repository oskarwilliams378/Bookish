const express = require('express');
const UserModel = require('../models/userModel');
const path = require('path');
const jwt = require('jsonwebtoken');

class UserController {
    constructor() {
        this.router = express.Router();
        this.router.get('/logout', this.getLogOut);
        this.router.post('/login', this.postLogIn);
        this.router.post('/signup', this.postSignUp);
    }

    postLogIn(req, res) {
        console.log('connection');
        UserModel.verifyLogin(req.body)
            .then(valid => {
                if (valid) {
                    const token = jwt.sign({ username: req.body.username }, 'secretsoftwireproject');
                    console.log('connection');
                    res.send(token);
                } else {
                    res.send('FAILURE');
                }
                
            });
    }

    postSignUp(req, res) {///// WWWWHHHHHYYYYYYYYYY
        const user = new UserModel(req.body);
        user.createUser().then(() => res.redirect('/user/login'));
    }

    getLogOut(req, res) {
        res.clearCookie('Authentication_Token');
        res.redirect('/user/login');
    }

}

module.exports = new UserController().router;