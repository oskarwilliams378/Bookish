const Author = require('../database/db').Author;

class AuthorModel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addAuthor() {
        return new Promise((resolve, reject) => {
            Author.create({ fullname: this.name })
                .then(() => resolve())
                .catch((err) => reject(err));
        });

    }
}

module.exports = AuthorModel;