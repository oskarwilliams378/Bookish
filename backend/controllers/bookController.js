const express = require('express');
const BookModel = require('../models/bookModel');
const auth = require('../authentication');
const path = require('path');

class BookController {
    constructor() {
        this.router = express.Router();
        this.router.use('/', auth);
        this.router.get('/', this.getAll);
        this.router.get('/id/:id', this.getById);
        this.router.get('/isbn/:isbn', this.getByISBN);
        this.router.get('/title/:title', this.getByTitle);
        this.router.get('/borrowed', this.getBorrowedBooks);
        this.router.get('/author/:author', this.getByAuthor);
        this.router.get('/authorid/:authorid', this.getByAuthorId);
        this.router.route('/add').get(this.getAddBook).post(this.postAddBook);
        this.router.route('/return').get(this.getReturn).post(this.postReturn);
        this.router.route('/borrow').get(this.getBorrow).post(this.postBorrow);

    }

    getAll(req, res) {
        BookModel.retrieveAll()
            .then(books => res.send(books));
    }

    getById(req, res) {
        BookModel.retrieveById(req.params.id)
            .then(book => res.send(book));
    }

    getByISBN(req, res) {
        BookModel.retrieveByISBN(req.params.isbn)
            .then(books => res.send(books));
    }

    getByTitle(req, res) {
        BookModel.retrieveByTitle(req.params.title)
            .then(books => res.send(books));
    }

    getBorrowedBooks(req, res) {
        BookModel.retrieveBorrowedBooks()
            .then(books => res.send(books));
    }

    getByAuthor(req, res) {
        BookModel.retrieveByAuthor(req.params.author)
            .then(books => res.send(books));
    }

    getByAuthorId(req, res) {
        BookModel.retrieveByAuthorId(req.params.authorid)
            .then(books => res.send(books));
    }

    getAddBook(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'addBook.html')); // eslint-disable-line no-undef
    }

    postAddBook(req, res) { // eslint-disable-line no-unused-vars
        const book = new BookModel({ title: req.body.title, isbn: req.body.isbn, edition: req.body.edition, image_url: null, barcode_image_url: 'placeholder' }, null, req.body.authorId);
        book.addBook().then(() => {
            res.send('');
        });
    }

    getBorrow(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'borrowBook.html'));// eslint-disable-line no-undef
    }

    postBorrow(req, res) {
        BookModel.borrowBook(req.body.id, req.body.username, req.body.duedate).then(() => {
            res.redirect('/book/borrowed');
        });
    }

    getReturn(req, res) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'returnBook.html'));// eslint-disable-line no-undef
    }

    postReturn(req, res) {
        BookModel.returnBook(req.body.id).then(() => {
            res.redirect('/book/borrowed');
        });
    }


}

module.exports = new BookController().router;