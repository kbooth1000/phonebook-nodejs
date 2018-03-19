const promisify = require('util').promisify;
var fs = require('fs');

var getDataFromFile = function (filename, callback) {
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
            callback('err');
        }
        if (data) {
            callback(data);
        }
    })
}
var getDataFromFileAsPromise = promisify(getDataFromFile);

var addEntry = function (filename, entry, callback) {
    getDataFromFileAsPromise(filename) 
        .then(function(dataArrayTxt){
        if (err) {
            throw err;
            callback('The file, \'' + filename + '\' is not found.');
        } else {
            // dataArrayTxt = dataArrayTxt.replace(/(\r\n\t|\n|\r\t)/gm,'');
            // dataArrayTxt = dataArrayTxt.replace(/ /g,'')
            // var parsedText = JSON.parse(dataArrayTxt);
            // console.log('parsed: ', parsedText);
            
            dataToArray = dataArrayTxt.split('},');
            // for(key in dataToArray){
            //     console.log('first_name: ', dataToArray[key].first_name);
                
            // }
            // console.log('dataToArray: ', dataToArray[1]['2']);
            
            var parsedEntry = entry.replace(/ /g,'').split(',');
            var objectifiedEntry = '\'first_name\': \''+parsedEntry[0]+'\', \'last_name\': \''+parsedEntry[1]+'\', \'phone\': \''+parsedEntry[2]+'\'';
            
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

module.exports = addEntry;