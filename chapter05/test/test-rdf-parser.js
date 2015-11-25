'use strict';

const
    rdfParser = require('../lib/rdf-parser.js'),
    expectedValue = require('./pg132.json');

exports.testRdfParser= function(test) {
    rdfParser(__dirname + '/pg132.rdf', function(err, book) {
        test.ifError(err);
        test.expect(2);
        test.deepEqual(book, expectedValue, "book should match expected");
        test.done();
    });
};
