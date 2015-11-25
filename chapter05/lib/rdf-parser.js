'use strict';

const
    fs = require('fs'),
    cheerio = require('cheerio');

module.exports = function(filename, callback) {
    fs.readFile(filename, function(err, data) {
        if (err) { return callback(err); }
        let
            $ = cheerio.load(data.toString(), { xmlMode: true }),
            authors = [],
            subjects = [];

        $('pgterms\\:agent pgterms\\:name').map(function (index, elem) {
            authors.push($(elem).text());
        });
        $('[rdf\\:resource$="/LCSH"] ~ rdf\\:value').map(function (index, elem) {
            subjects.push($(elem).text());
        });
        // Just in case the order of value for resources is wrong
        $('[rdf\\:resource$="/LCSH"]').prev('rdf\\:value').map(function(index, elem) {
            subjects.push($(elem).text());
        });

        // NOTE: review jquery selectors https://dzone.com/refcardz/jquery-selectors
        callback(null, {
            // get attribute rdf:about from element pgterms:ebook
            _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
            title: $('dcterms\\:title').text(),

            // Attribute pgterms:name descendant of pgterms:agent
            authors: authors,

            // Select rdf:value preceded by any element with attribute rdf:resources ending in LCSH
            subjects: subjects
        });
    });
};