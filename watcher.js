'use strict';

const fs       = require('fs'),
      spawn    = require('child_process').spawn,
      filename = process.argv[2];

if (!filename) {
    throw Error("You need to pass the name of the file to watch as parameter!");
}

fs.watchFile(filename, function () {
    var ls = spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});

console.log("Now watching for changes in '" + filename + "'...");