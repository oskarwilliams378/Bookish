const db = require('../database/db');

class Author {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addAuthor() {
        return new Promise((resolve, reject) => {
            db.none('INSERT INTO author (fullname) VALUES ($1)', this.name)
                .then(() => resolve())
                .catch((err) => reject(err));
        });

    }
}

module.exports = Author;