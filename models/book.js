const db = require('../database/db');

class Book {
    constructor({ id, title, isbn, edition, image_url, barcode_image_url }, author) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.edition = edition;
        this.imageURL = image_url;
        this.barcodeImageUrl = barcode_image_url;
        this.author = author;
    }

    addBook() {
        const bookId = new Promise((resolve, reject) => {
            db.one('INSERT INTO book (title, isbn, edition, image_url, barcode_image_url) VALUES ($1,$2,$3,$4,$5) RETURNING id',
                [this.title, this.isbn, this.edition, this.imageURL, this.barcodeImageUrl])
                .then(id => resolve(id.id))
                .catch(err => reject(err));
        });
        const authorId = new Promise((resolve, reject) => {
            db.none('INSERT INTO author (fullname) VALUES ($1) ON CONFLICT DO NOTHING',
                this.author)
                .then(() => {
                    db.one('SELECT id FROM author WHERE fullname = $1', this.author)
                        .then(id => resolve(id.id));
                })
                .catch(err => reject(err));
        });
        return new Promise((resolve, reject) => {
            Promise.all([bookId, authorId]).then(ids => {
                db.none('INSERT INTO bookauthor (bookid, authorid) VALUES ($1, $2)', ids)
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        });
    }

    retrieveAuthor() {
        return new Promise((resolve, reject) => {
            db.one('SELECT authorid FROM bookauthor WHERE bookid = $1', this.id)
                .then(authorid => db.one('SELECT fullname FROM author WHERE id = $1', authorid.authorid)
                    .then(fullname => resolve(fullname)))
                .catch(err => reject(err));
        });
    }

    static retrieveById(id) {
        return new Promise((resolve) => {
            db.one('SELECT * FROM book WHERE id = $1', id)
                .then(book => {
                    const bookObject = new Book(book, null);
                    bookObject.retrieveAuthor().then(name => {
                        bookObject.author = name.fullname;
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
                    const bookObject = new Book(book, null);
                    return bookObject.retrieveAuthor().then(name => {
                        bookObject.author = name.fullname;
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
                    const bookObject = new Book(book, null);
                    return bookObject.retrieveAuthor().then(name => {
                        bookObject.author = name.fullname;
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
                    const bookObject = new Book(book, null);
                    return bookObject.retrieveAuthor().then(name => {
                        bookObject.author = name.fullname;
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
}



module.exports = Book;
