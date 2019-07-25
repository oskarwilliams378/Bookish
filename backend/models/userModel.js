const Account = require('../database/db').Account;
const bcrypt = require('bcrypt');


class AccountModel {
    constructor({ fullname, username, password }) {
        this.name = fullname;
        this.username = username;
        this.password = password;
    }

    createUser() {
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.password, 10, (err, hash) => {
                Account.create({fullname: this.name, username: this.username, password: hash})
                    .then(() => resolve())
                    .catch((err) => reject(err));
            });

        });
    }

    static verifyLogin({ username, password }) {
        return new Promise((resolve, reject) => {
            Account.findOne({where: {username: username}, attributes: ['password']})
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

    static accountExists(username) {
        return new Promise((resolve) => {
            Account.findOne({where: {username: username}})
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }
}



module.exports = AccountModel;