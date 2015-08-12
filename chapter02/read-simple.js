'use strict';

const fs       = require('fs'),
      filename = process.argv[2];

if (!filename) {
    throw new Error("You need to specify an existing filename as parameter!");
}

fs.readFile(filename, function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data.toString());
});