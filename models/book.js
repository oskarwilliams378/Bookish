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
        return new Promise((resolve, reject) => {
            db.none('INSERT INTO book (title, isbn, edition, image_url, barcode_image_url) VALUES ($1,$2,$3,$4,$5)',
                [this.title, this.isbn, this.edition, this.imageURL, this.barcodeImageUrl])
                .then(book => resolve(new Book(book, null)))
                .catch(err => reject(err));
        });
    }

    static retrieveById(id) {
        return new Promise((resolve, reject) => {
            db.one('SELECT * FROM book WHERE id = $1', id)
                .then(book => resolve(new Book(book, null)))
                .catch(err => reject(err));
        }
        );
    }

    static retrieveByISBN(isbn) {
        return new Promise((resolve, reject) => {
            db.any('SELECT * FROM book WHERE isbn = $1', isbn)
                .then(books => resolve(books.map(book => new Book(book, null))))
                .catch(err => reject(err));
        });
    }

    static retrieveAll() {
        return new Promise((resolve, reject) => {
            db.any('SELECT * FROM book')
                .then(books => resolve(books.map(book => new Book(book, null))))
                .catch(err => reject(err));
        });
    }

    static retrieveByTitle(title) {
        return new Promise((resolve, reject) => {
            db.any('SELECT * FROM book WHERE title = $1', title)
                .then(books => resolve(books.map(book => new Book(book, null))))
                .catch(err => reject(err));
        });
    }
}

module.exports = Book;