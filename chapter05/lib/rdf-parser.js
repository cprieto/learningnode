'use strict';

const
    fs = require('fs'),
    cheerio = require('cheerio');

module.exports = function(filename, callback) {
    fs.readFile(filename, function(err, data) {
        if (err) { return callback(err); }
        let
            $ = cheerio.load(data.toString()),
            collect = function(index, elem) {
                return $(elem).text();
            };
        // NOTE: review jquery selectors https://dzone.com/refcardz/jquery-selectors
        callback(null, {
            // get attribute rdf:about from element pgterms:ebook
            _id: $('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''),
            title: $('dcterms\\:title').text(),

            // Attribute pgterms:name descendant of pgterms:agent
            authors: $('pgterms\\:agent pgterms\\:name').map(collect),

            // Select rdf:value preceded by any element with attribute rdf:resources ending in LCSH
            subjects: $('[rdf\\:resources$="/LCSH"] ~ rdf\\:value').map(collect)
        });
    });
};