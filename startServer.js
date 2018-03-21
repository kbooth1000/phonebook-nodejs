const http = require('http');
const phonebookArray = require('./phonebook-data');
const listAllEntries = require('./listAllEntries');
const put = require('./put');

var contacts = phonebookArray.pb;

var contactsText = JSON.stringify(contacts);
var lastId = 0;

var findContact = function (id) {
    return contacts.find(function (contact) {
        return contact.index === id;
    });
}
var server = http.createServer(function (request, response) {
    var requestUrl = request.url;
    var requestUrlArray;
    var requestSuffix;



    var routes = [{
            method: 'DELETE',
            path: '/contacts/',
            handler: deleteContact
        },
        {
            method: 'GET',
            path: '/contacts/',
            handler: getContact
        },
        {
            method: 'PUT',
            path: '/contacts/',
            handler: putContact
        },
        {
            method: 'GET',
            path: '/contacts',
            handler: getContacts
        },
        {
            method: 'POST',
            path: '/contacts',
            handler: postContacts
        }
    ]
    var matches = function (request, method, path) {
        return request.method === method && request.url.startsWith(path);
    }

    var readBody = function (request, callback) {
        var body = '';
        request.on('data', function (chunk) {
            body += chunk.toString();
        });
        request.on('end', function () {
            callback(body);
        });
    };

    var getContacts = function(request, response) {
        response.end(JSON.stringify(contacts));
    };

    var postContacts = function (request, response) {
        readBody(request, function (body) {
            var contact = JSON.parse(body);
            contact.index = ++lastId;
            contacts.push(contact);
            response.end('Created contact: '+ contact);
        });
    };
    var getRequestSuffix = function(request) {
        var requestUrlArray = request.url.split('/');
        return requestUrlArray[2];
    };
    var deleteContact = function(request, response) {
        var id = getRequestSuffix(request);
        var contact = findContact(id);
    };

    var getContact = function(request,response) {
        var id = getRequestSuffix(request);
        var contact = findContact(id);
        response.on('end', JSON.stringify(content) );
    }
    var putContact = put(request, response);

    var notFound = function(request,response) {
        response.statusCode - 404;
        response.end('404, Nothing here.');
    }

    var route = routes.find(function (route) {
        return matches(request, response);
    })

    if (requestUrl.startsWith('/contacts')) {
        // getRequestSuffix(request);

        if (request.method === 'GET') {

            if (requestUrl === '/contacts') {
                response.write('<h1>Phonebook:</h1><div style="margin:auto; width: 60%; padding: 20px; border: 1px solid #666">');
                response.end('<h2>contact list:</h2> ' + contacts + '</div>');
            }
            if (requestSuffix) {
                response.end('contact: ' + JSON.stringify(findContact(requestSuffix)));
            }
        } else if (request.method === 'POST') {
            request.on('end', function () {
                postContacts(request, response);
            })
        }
    }

    var responseContent = '<h1>Hello!</h1>';
    console.log('Connect');
    response.end(JSON.stringify(contacts));
});

server.listen(3000);