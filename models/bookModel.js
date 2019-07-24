const db = require('../database/db');
const JsBarcode = require('jsbarcode');
const Canvas = require('canvas');

class Book {
    constructor({ id, title, isbn, edition, image_url, barcode_image_url }, author, authorId) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.edition = edition;
        this.imageURL = image_url;
        this.barcodeImageUrl = barcode_image_url;
        this.author = author;
        this.authorId = authorId;
    }

    getBarcode(id) {
        const canvas = Canvas.createCanvas(200, 200);
        JsBarcode(canvas, id);
        return canvas.toDataURL();
    }

    addBook() {
        return new Promise((resolve, reject) => {
            db.one('INSERT INTO book (title, isbn, edition, image_url, barcode_image_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
                [this.title, this.isbn, this.edition, this.imageURL, this.barcodeImageUrl])
                .then(id => {
                    this.barcodeImageUrl = this.getBarcode(id.id);
                    db.none('UPDATE book SET barcode_image_url = $1 WHERE id = $2', [this.barcodeImageUrl, id.id])
                        .then(() =>
                            db.none('INSERT INTO bookauthor (bookid, authorid) VALUES ($1, $2)', [id.id, this.authorId])
                                .then(() => resolve())
                                .catch(err => reject(err)));
                })
                .catch(err => reject(err));
        });
    }

    retrieveAuthor() {
        return new Promise((resolve, reject) => {
            db.one('SELECT authorid FROM bookauthor WHERE bookid = $1', this.id)
                .then(authorid => db.any('SELECT * FROM author WHERE id = $1', authorid.authorid)
                    .then(author => resolve(author)))
                .catch(err => reject(err));
        });
    }

    static retrieveBorrowedBooks() {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            db.any('SELECT bookid FROM borrowbooks WHERE returned = false')
                .then(bookIds => {
                    return Promise.all(bookIds.map(bookId => this.retrieveById(bookId.bookid)))
                        .then(books => resolve(books))
                        .catch(() => resolve([]));
                });
        });
    }

    static borrowBook(bookid, username, dueDate) {
        return new Promise((resolve, reject) => {
            db.none('INSERT INTO borrowbooks (bookid, accountusername, duedate, returned) VALUES ($1, $2, $3, false)', [bookid, username, dueDate])
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    static returnBook(bookid) {
        const date = new Date();
        const formatDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; 
        return new Promise((resolve, reject) => {
            db.none('UPDATE borrowbooks SET returned = true, returndate = $1 WHERE bookid = $2 AND returned = false', [formatDate,bookid])
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    static retrieveById(id) {
        return new Promise((resolve) => {
            db.one('SELECT * FROM book WHERE id = $1', id)
                .then(book => {
                    const bookObject = new Book(book, null, null);
                    bookObject.retrieveAuthor().then(author => {
                        bookObject.author = author[0].fullname;
                        bookObject.authorId = author[0].id;
                        resolve(bookObject);
                    });
                })
                .catch(() => resolve([]));
        }
        );
    }

    static retrieveByISBN(isbn) {
        return new Promise((resolve) => {
            db.any('SELECT * FROM book WHERE isbn = $1', isbn)
                .then(books => Promise.all(books.map(book => {
                    const bookObject = new Book(book, null, null);
                    return bookObject.retrieveAuthor().then(author => {
                        bookObject.author = author[0].fullname;
                        bookObject.authorId = author[0].id;
                        return bookObject;
                    });
                })).then(books => resolve(books)))
                .catch(() => resolve([]));
        });
    }

    static retrieveAll() {
        return new Promise((resolve) => {
            db.any('SELECT * FROM book')
                .then(books => Promise.all(books.map(book => {
                    const bookObject = new Book(book, null, null);
                    return bookObject.retrieveAuthor().then(author => {
                        bookObject.author = author[0].fullname;
                        bookObject.authorId = author[0].id;
                        return bookObject;
                    });
                })).then(books => resolve(books)))
                .catch(() => resolve([]));
        });
    }

    static retrieveByTitle(title) {
        return new Promise((resolve) => {
            db.any('SELECT * FROM book WHERE title = $1', title)
                .then(books => Promise.all(books.map(book => {
                    const bookObject = new Book(book, null, null);
                    return bookObject.retrieveAuthor().then(author => {
                        bookObject.author = author[0].fullname;
                        bookObject.authorId = author[0].id;
                        return bookObject;
                    });
                })).then(books => resolve(books)))
                .catch(() => resolve([]));
        });
    }

    static retrieveByAuthor(author) {
        return new Promise((resolve) => {
            db.one('SELECT id FROM author WHERE fullname = $1', author)
                .then(id => {
                    db.any('SELECT bookid FROM bookauthor WHERE authorid = $1', id.id)
                        .then(bookids => {
                            Promise.all(bookids.map(bookid => this.retrieveById(bookid.bookid)))
                                .then(books => resolve(books));
                        });
                })
                .catch(() => resolve([]));
        });
    }

    static retrieveByAuthorId(authorId) {
        return new Promise((resolve) => {
            db.any('SELECT bookid FROM bookauthor WHERE authorid = $1', authorId)
                .then(bookids => {
                    Promise.all(bookids.map(bookid => this.retrieveById(bookid.bookid)))
                        .then(books => resolve(books));
                })
                .catch(() => resolve([]));
        });
    }



}



module.exports = Book;
