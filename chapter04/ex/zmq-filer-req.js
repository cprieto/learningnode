'use strict';

const zmq      = require('zmq'),
      req      = zmq.socket('req'),
      filename = process.argv[2],
      util = require('util');

if (!filename) {
    throw new Error("You need to pass a filename as parameter.");
}

req.on('message', function (data) {
    var response = JSON.parse(data);
    console.log("Receiving response: " + util.inspect(response));
});

req.connect('tcp://localhost:5433');
console.log("Sending request for '" + filename + "'.");

req.send(JSON.stringify({
    path: filename
}));