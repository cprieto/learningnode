'use strict';

const fs       = require('fs'),
      spawn    = require('child_process').spawn,
      filename = process.argv[2];

if (!filename) {
    throw Error("You need to pass the name of the file to watch as parameter!");
}

fs.watchFile(filename, function () {
    var output = '',
        ls     = spawn('ls', ['-lh', filename]);

    ls.stdout.on('data', function(chunk) {
        output += chunk.toString();
        console.log(output);
    });

    ls.on('close', function() {
        var parts = output.split(/\s+/);
        console.dir(parts);
    });
});

console.log("Now watching for changes in '" + filename + "'...");