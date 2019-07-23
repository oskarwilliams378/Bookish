const express = require('express');
const postgres = require('pg-promise')();

const Book = require('./book');

const db = postgres('postgres://bookish:Softwire@localhost:5432/bookish');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/books', (req, res) => {
    db.any('SELECT * FROM book').then(data => res.send(data));
});

app.listen(3000, () => console.log('Listening to the app'));