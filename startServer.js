const promisify = require('util').promisify;
const http = require('http');
const phonebookArray = require('./phonebook-data');
const listAllEntries = require('./listAllEntries');
const addEntry = require('./addEntry');
const fs = require('fs');
// const put = require('./put');

let contacts = [{
    'id': '1',
    'name': 'Jim',
    'email': 'Jones',
    'phone': '212-675-8570',
    'address': 'Address for Jim'
}, {
    'id': '2',
    'name': 'Jamal',
    'email': 'Fletcher',
    'phone': '303-724-7371',
    'address': 'Address for Jamal'

}, {
    'id': '3',
    'name': 'Francine',
    'email': 'Redfield',
    'phone': '913-388-2079',
    'address': 'Address for Francine'

}
, {
    'id': '4',
    'name': 'Anne',
    'email': 'Johnson',
    'phone': '404-339-7942',
    'address': 'Address for Anne'
}, {
    'id ': '5',
    'name': 'Glen',
    'email': 'Jones',
    'phone': '212-462-9157',
    'address': 'Address for Glen'
}, {
    'id ': '6',
    'name': 'jim',
    'email': 'booth',
    'phone': '4343',
    'address': 'Address for jim'
}, {
    'id ': '7',
    'name': 'abe',
    'email': 'lincoln',
    'phone': '4442226666',
    'address': 'Address for abe'
}, {
    'id ': '8',
    'name': 'k',
    'email': 'b',
    'phone': '444',
    'address': 'Address for k'
}, {
    'id ': '9',
    'name': 'george',
    'email': 'washington',
    'phone': '2023334444',
    'address': 'Address for George'
}, {
    'id ': '10',
    'name': 'Dan',
    'email': 'Allen',
    'phone': '848837748',
    'address': 'Address for Dan'
}, {
    'id ': '11',
    'name': 'Harold',
    'email': 'Anderson',
    'phone': '4050049933',
    'address': 'Address for Harold'
}];

// listAllEntries.getDataFromFile('phonebook-data.txt', function (data) {
//     console.log('Data',data);

//     return data;
// });

let lastId = 0;

let findContact = function (id) {
    id = parseInt(id, 10);
    // console.log('findContact: ', contacts[id]);
    return contacts[id];
}


let matches = function (request, method, path) {
    return request.method === method && path.exec(request.url);
};

let readBody = (request, callback) => {
    let body = '';
    request.on('data', (chunk) => {
        body += chunk.toString();
    });
    request.on('end', function () {
        callback(body);
    });
};
let readBodyAsPromise = promisify(readBody);


let getContacts = function (request, response) {
    console.log('GETCONTACTS');
    response.end(JSON.stringify(contacts));
};

let postContacts = function (request, response, params) {
    readBodyAsPromise(request).then((body) => {
        console.log('BODY: ', body);
        let contact = JSON.parse(body);
        contact.id  = ++lastId;
        contacts.push(contact);
        response.end('Created contact: ' + contact, addEntry('phonebook-data.txt', contact, function (data) {
            console.log('data: ', data);
        }));
    });
};

let deleteContact = function (request, response, id) {
    let contactToDelete = findContact(id);
    console.log('Contact to delete: ', contactToDelete);
    let newContacts = contacts.filter(contact => contact !== contactToDelete);
    response.end('new list: ' + newContacts);
    return newContacts;
};
let getContact = function (request, response, id) {
    let contact = findContact(id);
    response.on('end', JSON.stringify(contact));
    // response.end('GET CONTACTS');
};
let putContact = function (request, response, params) {
    console.log('PUT NOT YET WORKING');
}


let notFound = function (request, response) {
    response.statusCode = 404;
    response.end('404, Nothing here.');
};

let renderHomepage = function (request, response) {
    fs.readFile('static/index.html', function (err, data) {
        if (err) {
            throw err;
        }
        if (data) {
            response.statusCode = 200;
            response.setHeader('Content-type', 'text/html');
            response.write(data);
            response.end();
        }
    });
}

let renderInnerPage = function (request, response) {
    console.log('innerpage');
    let filename = request.url.split('/')[1];
    if(filename.startsWith('favicon') ) filename = 'id .html';
    console.log('filename: ', filename);
    fs.readFile('static/' + filename, function (err, data) {
        // if (filename.startsWith('favicon')) {
            //throw err;
            // response.end('favicon bullshit');
            if (err) {
                console.log('FN: ' + filename);
                response.setStatus = 404;
                response.end('End');
                //throw err;
            }
        // }
        if (data) {
            response.statusCode = 200;
            response.write(data);
            response.end();
        }
    });
};


let routes = [{
        method: 'DELETE',
        path: /^\/contacts\/[0-9]+$/,
        handler: deleteContact
    },
    {
        method: 'GET',
        path: /^\/contacts\/[0-9]+[\/]?$/,
        handler: getContact
    },
    {
        method: 'PUT',
        path: /^\/contacts\/[0-9]+$/,
        handler: putContact
    },
    {
        method: 'GET',
        path: /^\/contacts$/,
        handler: getContacts
    },
    {
        method: 'POST',
        path: /^\/contacts\/$/,
        handler: postContacts
    },
    {
        method: 'GET',
        path: /^\/$/,
        handler: renderHomepage
    },
    {
        method: 'GET',
        path: /^\/[a-zA-Z0-9\.\-_]*$/,
        handler: renderInnerPage
    }
]

let server = http.createServer(function (request, response) {
    console.log('HEYYYY');
    
    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'} );
        response.end();
        console.log('favicon requested');
        return;
      }
    console.log('Connect');
    let matchedRoute = routes.find((matchedRoute) => {
        return matches(request, matchedRoute.method, matchedRoute.path);
    });
    let id = request.url.split('/').pop();
    matchedRoute ? matchedRoute.handler(request, response, id) :
        notFound(request, response);
});



server.listen(3000);