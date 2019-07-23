const postgres = require('pg-promise')();
module.exports = postgres('postgres://bookish:Softwire@localhost:5432/bookish');