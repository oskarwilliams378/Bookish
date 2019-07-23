const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const Book = require('./models/book');
const User = require('./models/user');
const auth = require('./authentication');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello Books');
});

app.get('/book', auth, (req, res) => {
    Book.retrieveAll()
        .then(books => res.send(books));
    
});

app.route('/book/add')
    .get((req, res) => res.sendFile(path.join(__dirname, 'frontend', 'addBook.html'))) // eslint-disable-line no-undef
    .post((req, res) => { // eslint-disable-line no-unused-vars
        const book = new Book({title: req.body.title, isbn: req.body.isbn, edition: req.body.edition, image_url: null, barcode_image_url:'placeholder'}, req.body.author);
        book.addBook();
    });

app.route('/login')
    .get((req, res) => res.sendFile(path.join(__dirname, 'frontend', 'login.html'))) // eslint-disable-line no-undef
    .post((req, res) => {
        User.checkFull(req.body)
            .then(valid => {
                if (valid) {
                    const token = jwt.sign({username : req.body.username}, 'secretsoftwireproject');
                    res.cookie('Authentication_Token', token);
                    res.redirect('/books');
                }
            });
    });

app.route('/signup')
    .get((req, res) => res.sendFile(path.join(__dirname, 'frontend', 'signup.html'))) // eslint-disable-line no-undef
    .post((req, res) => {
        const user = new User(req.body);
        user.createUser().then(() => res.redirect('/login'));
    });

app.get('/signup', (req, res) => {
    const user = new User(req.query);
    user.createUser().then(() => res.send('Done'));
});

app.get('/logout', (req, res) => {
    res.clearCookie('Authentication_Token');
    res.redirect('/');
});

app.listen(3000, () => console.log('Listening to the app'));