const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://bookish:Softwire@localhost:5432/bookish');

class Account extends Sequelize.Model{}
Account.init({
    fullname: Sequelize.STRING,
    username: {type: Sequelize.STRING, primaryKey: true},
    password: Sequelize.STRING
}, {sequelize, modelName: 'account'});

class Book extends Sequelize.Model{}
Book.init({
    title: Sequelize.STRING,
    isbn: Sequelize.STRING,
    edition: Sequelize.STRING,
    image_url: Sequelize.TEXT,
    barcode_image_url: Sequelize.TEXT
}, {sequelize, modelName: 'book'});

class Author extends Sequelize.Model{}
Author.init({
    fullname: Sequelize.STRING,
    pseudonym1: Sequelize.STRING,
    pseudonym2: Sequelize.STRING,
    pseudonym3: Sequelize.STRING,
    image_url: Sequelize.TEXT
}, {sequelize, modelName: 'author'});

class BookAuthor extends Sequelize.Model{}
BookAuthor.init({}, {sequelize, modelName: 'bookauthor'});

class BorrowedBook extends Sequelize.Model{}
BorrowedBook.init({
    duedate: Sequelize.STRING,
    returned: Sequelize.BOOLEAN,
    returndate: Sequelize.STRING
}, {sequelize, modelName: 'borrowedbook'});


/* THIS IS THE WORST POSSIBLE WAY TO DO A FOREIGN KEY */
Book.hasOne(BookAuthor);
BookAuthor.belongsTo(Book);
Author.hasOne(BookAuthor);
BookAuthor.belongsTo(Author);
Book.hasOne(BorrowedBook);
BorrowedBook.belongsTo(Book);
Account.hasOne(BorrowedBook);
BorrowedBook.belongsTo(Account);

module.exports = {
    Account: Account,
    Book: Book,
    Author: Author,
    BookAuthor: BookAuthor,
    BorrowedBook: BorrowedBook
};