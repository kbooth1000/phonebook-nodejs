const promisify = require('util').promisify;
const addEntry = require('./addEntry');
const deleteEntry = require('./deleteEntry');
const searchByKey = require('./searchByKey');
const sortByKey = require('./sortByKey');
const listAllEntries = require('./listAllEntries');
const phonebookArray = require('./phonebook-data');


const readline = require('readline');
// const readlineAsPromise = promisify(readline);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const questionAsPromise = function(question) {
    return new Promise(function(resolve) {
        rl.question(question, resolve);
    });
};

questionAsPromise(`1. Look up an entry
2. Set an entry
3. Delete an entry
4. List all entries
5. Sort by first name, last name or phone number
6. Quit

What would you like to do? (1-6) `)
    .then(function(answer) {
    console.log('ANSWER: '+answer+'.');
    if (answer === '1') {
        console.log('##1');
        searchByKey(function (message) {
            console.log('Message' + message);
        });
    } else
    if (answer === '2') {
        askForNewEntry(answer);
        // rl.question(('Entry: '), (answer) => {
        //     console.log('##2');
        //     addEntry('phonebook-data.txt', answer, function (message2) {
        //         console.log('Message' + message2);
        //     });
        //     rl.close();
        // });
    } else
    if (answer === '3') {
        console.log('##3');
        deleteEntry(function (message) {
            console.log('Message' + message);
        });
    } else
    if (answer === '4') {
        console.log('##4');
        listAllEntries('phonebook-data.txt', function (message) {
            console.log('Message: ' + message);
        });
    } else
    if (answer === '5') {
        console.log('##1');
        sortByKey(function (message) {
            console.log('Message' + message);
        });
    } else {rl.close();}

    
});

var askForNewEntry = function(answer){
    rl.question(('Entry (first name, last name, phone number): '), (answer) => {
        console.log('##2');
        addEntry('phonebook-data.txt', answer, function (message2) {
            console.log('Message' + message2);
        });
        rl.close();
    });
}