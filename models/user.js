const db = require('../database/db');
const bcrypt = require('bcrypt');

class User {
    constructor({ fullname, username, password }) {
        this.name = fullname;
        this.username = username;
        this.password = password;
    }

    createUser() {
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.password, 10, (err, hash) => {
                db.none('INSERT INTO public.account (fullname, username, password) VALUES ($1, $2, $3)',
                    [this.name, this.username, hash])
                    .then(() => resolve())
                    .catch((err) => reject(err));
            });

        });
    }

    static checkFull({ username, password }) {
        return new Promise((resolve, reject) => {
            db.one('SELECT password FROM account WHERE username = $1', username)
                .then(hashedPassword => {
                    bcrypt.compare(password, hashedPassword.password, (err, res) => {
                        if (!err) {
                            resolve(res);
                        }
                    });
                })
                .catch((err) => reject(err));
        }
        );
    }

    static checkName(username) {
        return new Promise((resolve) => {
            db.one('SELECT * FROM account WHERE username = $1', username)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }
}


module.exports = User;