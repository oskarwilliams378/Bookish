const SQ = require('../database/db');
const Book = SQ.Book;
const Author = SQ.Author;
const BookAuthor = SQ.BookAuthor;
const BorrowedBook = SQ.BorrowedBook;
const JsBarcode = require('jsbarcode');
const Canvas = require('canvas');

class BookModel {
    constructor({ id, title, isbn, edition, image_url, barcode_image_url }, author, authorId) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.edition = edition;
        this.imageUrl = image_url;
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
            Book.create({ title: this.title, isbn: this.isbn, edition: this.edition, image_url: this.imageUrl, barcode_image_url: this.barcodeImageUrl })
                .then(book => {
                    this.id = book.id;
                    this.barcodeImageUrl = this.getBarcode(this.id);
                    Book.update({ barcode_image_url: this.barcodeImageUrl }, { where: { id: this.id } })
                        .then(() => BookAuthor.create({ bookId: this.id, authorId: this.authorId })
                            .then(() => resolve())
                            .catch(err => reject(err)));
                })
                .catch(err => reject(err));
        });
    }

    retrieveAuthor() {
        return new Promise((resolve, reject) => {
            BookAuthor.findOne({ where: { bookId: this.id } })
                .then(bookauthor => {
                    Author.findOne({ where: { id: bookauthor.authorId } })
                        .then(author => resolve(author));
                }
                )
                .catch(err => reject(err));
        });
    }

    static retrieveBorrowedBooks() {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            Book.findAll({ include: [{ model: BorrowedBook, where: { returned: false } }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }

    static borrowBook(bookId, username, dueDate) {
        return new Promise((resolve, reject) => {
            BorrowedBook.create({ bookId: bookId, accountUsername: username, duedate: dueDate, returned: false })
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    static returnBook(bookId) {
        const date = new Date();
        const formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        return new Promise((resolve, reject) => {
            BorrowedBook.update({ returned: true, returndate: formatDate }, { where: { bookId: bookId } })
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }

    static retrieveById(id) {
        return new Promise((resolve) => {
            Book.findOne({ where: { id: id }, include: [{ model: BookAuthor, include: [{ model: Author }] }] })
                .then(book => resolve(book))
                .catch(() => resolve([]));
        }
        );
    }

    static retrieveByISBN(isbn) {
        return new Promise((resolve) => {
            Book.findAll({ where: { isbn: isbn }, include: [{ model: BookAuthor, include: [{ model: Author }] }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }

    static retrieveAll() {
        return new Promise((resolve) => {
            Book.findAll({ include: [{ model: BookAuthor, include: [{ model: Author }] }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }

    static retrieveByTitle(title) {
        return new Promise((resolve) => {
            Book.findAll({ where: { title: title }, include: [{ model: BookAuthor, include: [{ model: Author }] }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }

    static retrieveByAuthor(author) {
        return new Promise((resolve) => {
            Book.findAll({ include: [{ model: BookAuthor, include: [{ model: Author, where: { fullname: author } }] }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }

    static retrieveByAuthorId(authorId) {
        return new Promise((resolve) => {
            Book.findAll({ include: [{ model: BookAuthor, where: { authorId: authorId }, include: [{ model: Author }] }] })
                .then(books => resolve(books))
                .catch(() => resolve([]));
        });
    }
}







module.exports = BookModel;
