const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const Book = require('./models/book');
const User = require('./models/user');
const auth = require('./authentication');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/books', auth, (req, res) => {
    Book.retrieveAll()
        .then(books => res.send(books));
    
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