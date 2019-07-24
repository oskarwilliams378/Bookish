const express = require('express');
const app = express();

const bookController = require('./controllers/bookController');
const authorController = require('./controllers/authorController');
const userController = require('./controllers/userController');

app.use(express.urlencoded({ extended: false }));

app.use('/book', bookController);
app.use('/author', authorController);
app.use('/user', userController);

app.use('/', (req, res) => res.redirect('/book'));

app.listen(3000, () => console.log('Listening to the app'));