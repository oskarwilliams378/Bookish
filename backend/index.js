const express = require('express');
const app = express();
const cors = require('cors');

const bookController = require('./controllers/bookController');
const authorController = require('./controllers/authorController');
const userController = require('./controllers/userController');

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.use('/book', bookController);
app.use('/author', authorController);
app.use('/user', userController);

app.use('/', (req, res) => res.redirect('/book'));

app.listen(3001, () => console.log('Listening to the app'));