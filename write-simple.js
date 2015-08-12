'use strict';

var fs = require('fs');

fs.writeFile('target.txt', 'weird message here... ', function(err) {
    if (err) {
        throw err;
    }
    console.log("I wrote things into the file!");
});