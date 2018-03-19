const addEntry = require('./addEntry');
const deleteEntry = require('./deleteEntry');
const searchByKey = require('./searchByKey');
const sortByKey = require('./sortByKey');
const listAllEntries = require('./listAllEntries');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`1. Look up an entry
2. Set an entry
3. Delete an entry
4. List all entries
5. Sort by first name, last name or phone number
6. Quit

What would you like to do? (1-6) `, (answer) => {
    console.log('ANSWER: '+answer+'.');
    if (answer === '1') {
        console.log('##1');
        searchByKey(function (message) {
            console.log('Message' + message);
        });
    }
    if (answer === '2') {
        console.log('##2');
        addEntry(function (message) {
            console.log('Message' + message);
        });
    }
    if (answer === '3') {
        console.log('##3');
        deleteEntry(function (message) {
            console.log('Message' + message);
        });
    }
    if (answer === '4') {
        console.log('##1');
        listAllEntries(function (message) {
            console.log('Message: ' + message);
        });
    }
    if (answer === '5') {
        console.log('##1');
        sortByKey(function (message) {
            console.log('Message' + message);
        });
    }

    rl.close();
});