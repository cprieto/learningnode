'use strict';
const
    async = require('async'),
    file  = require('file'),
    rdfParser = require('./lib/rdf-parser.js'),
    work = async.queue(function (path, next) {
        rdfParser(path, function (err, doc) {
            if (err) throw err;
            console.log(doc);
        });
    }, 1000);

console.log("beginning directory walk");

file.walk(__dirname + '/cache', function (err, dirPath, dirs, files) {
    files.forEach(function (path) {
        work.push(path);
    });
});