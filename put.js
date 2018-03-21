const promisify = require('util').promisify;
var fs = require('fs');

let filename = 'phonebook-data.txt'

var getContacts = function (filename, callback) {
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
            callback('err');
        }
        if (data) {
            callback(data);
        }
    });
};

var getContactsAsPromise = promisify(getContacts);


var getRequestSuffix = function (request) {
    var requestUrlArray = request.url.split('/');
    return requestUrlArray[2];
};
var readBody = function (request, callback) {
    var body = '';
    request.on('data', function (chunk) {
        body += chunk.toString();
    });
    request.on('end', function () {
        callback(body);
    });
};
var findContact = function (id) {
    return contacts.find(function (contact) {
        return contact.index === id;
    });
}

var putContact = function (request, response) {
    var id = getRequestSuffix(request);
    var contact = findContact(id);
    readBody(request, function (body) {
        Object.assign(contact, newParams);
        response.end('Contact updated.', function () {
            addEntry('phonebook-data.txt', contact, function (message) {
                console.log('Message' + message);
            })
        })
    });
};



var addEntry = function (filename, entry, callback) {
    getContactsAsPromise(filename)
        .then(function (dataArrayTxt) {
            if (err) {
                throw err;
                callback('The file, \'' + filename + '\' is not found.');
            } else {
                dataToArray = dataArrayTxt.split('},');
                var parsedEntry = entry.replace(/ /g, '').split(',');
                var objectifiedEntry = '\'first_name\': \'' + parsedEntry[0] + '\', \'last_name\': \'' + parsedEntry[1] + '\', \'phone\': \'' + parsedEntry[2] + '\'';

                dataArrayTxt += `{  \'index\':\'${dataToArray.length}\', ${objectifiedEntry}}, `;
                callback('Entry added: ', entry);

                // now save the new array as a file named [filename]
                fs.writeFile(filename, dataArrayTxt, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                });
            }
        });
};

module.exports = putContact;