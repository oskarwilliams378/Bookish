const postgres = require('pg-promise')();
const db = postgres('postgres://bookish:Softwire@localhost:5432/bookish');

class Book {
    constructor() {

    }

    static retrieveById(id) {
        return new Promise((resolve, reject) => {
            db.one('SELECT * FROM book WHERE id = $1', id)
                .then(book => resolve(book))
                .catch(err => reject(err));
        }
        );
    }

    static retrieveByISBN(isbn) {
        return new Promise((resolve, reject) => {
            db.any('SELECT * FROM book WHERE isbn = $1', isbn)
                .then(books => resolve(books))
                .catch(err => reject(err));
        });
    }

    static retrieveAll() {
        return new Promise((resolve, reject) => {
            db.any('SELECT * FROM book')
                .then(books => resolve(books))
                .catch(err => reject(err));
        });
    }

    static retrieveByAuthor(author) {

    }

    static retrieveByTitle(title) {

    }
    
    static retrieveByAccount(account) {

    }
}

exports = Book;

Book.retrieveAll().then(book => console.log(book));