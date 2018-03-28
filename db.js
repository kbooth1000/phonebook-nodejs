const pg = require('pg-promise')();
const db = pg('postgres://kboot@localhost:5432/phonebook_db');

db.query(`SELECT name FROM contacts;`)

    // db.query(`INSERT INTO contacts 
    // (name, email, phone, address)
    //  values ('Abe Lincoln', 'alincoln@tophat.com', '202-888-3000', '1776 Delaware Ave')`)
    .then(results => {
        console.log('results: ', results);
        return results;
    })
    .catch(error => console.log('error: ', error))
    .then(() => pg.end());

let getAllContacts = () => {
    db.query(`select * from contacts[0];`)
        .then(results => {
            console.log('results: ', results);
            return results;
        })
        .catch(error => console.log('error: ', error))
        .then(() => pg.end());
};

module.exports = getAllContacts;