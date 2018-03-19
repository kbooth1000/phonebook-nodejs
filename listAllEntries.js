var fs = require('fs');

var getDataFromFile = function(filename, callback) {
    fs.readFile(filename, 'utf8', function(err,data) {
        if (err) {
            callback('The file, \''+filename+'\' is not found.');
        }
        if(data) {
            callback( data);
        }
    })
}



module.exports = getDataFromFile;