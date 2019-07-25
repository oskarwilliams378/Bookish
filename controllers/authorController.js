const express = require('express');
const AuthorModel = require('../models/authorModel');
const auth = require('../authentication');
const path = require('path');

class AuthorController {
    constructor() {
        this.router = express.Router();
        this.router.use('/', auth);
        this.router.route('/add').get(this.getAddAuthor).post(this.postAddAuthor);
    }

    getAddAuthor(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'addAuthor.html')); // eslint-disable-line no-undef
    }

    postAddAuthor(req, res) { // eslint-disable-line no-unused-vars
        const author = new AuthorModel(null, req.body.name);
        author.addAuthor().then(() => {
            res.redirect('/book/add');
        });
    }


}

module.exports = new AuthorController().router;