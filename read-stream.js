'use strict';

const fs       = require('fs'),
      filename = process.argv[0];

if (!filename) {
    throw new Error("You need to specify an existing filename as parameter!");
}

var stream = fs.createReadStream(filename);
stream.on('data', function(chunk) {
    process.stdout.write(chunk);
});

stream.on('error', function(err) {
    process.stderr.write('ERROR ' + err.message + '\n');
});