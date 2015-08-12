'use strict';

var fs       = require('fs'),
    filename = process.argv[2];

if (!filename) {
    throw new Error("You need to specify an existing filename as parameter!");
}

fs.createReadStream(filename).pipe(process.stdout);