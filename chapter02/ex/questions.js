'use strict';

const  fs = require('fs'),
    spawn = require('child_process').spawn;

const processToSpawn = process.argv[2];
if (!processToSpawn) {
    throw new Error("You need to specify the process to spawn")
}

var additionalArgs = [];
if (process.argv.length > 3) {
    additionalArgs = process.argv.slice(3);
}

var ls = spawn(processToSpawn, additionalArgs);
ls.stdout.on('data', function(chunk) {
    process.stdout.write(chunk);
})