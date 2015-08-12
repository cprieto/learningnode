const fs = require('fs'),
    filename = process.argv[2];

if (!filename) {
    throw Error("You need to pass the name of the file to watch as parameter!");
}

fs.watchFile(filename, function () {
    console.log("File '" + filename + "' just changed.");
});

console.log("Now watching for changes in '" + filename + "'...");