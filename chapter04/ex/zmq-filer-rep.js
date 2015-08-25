'use strict';

const zmq = require('zmq'),
      fs  = require('fs');

const rep = zmq.socket('rep');

rep.on('message', function(data) {
    var request = JSON.parse(data);
    console.log("Requested file '" + request.path + "'.");
    fs.readFile(request.path, function(err, content) {
        // Task1: Add support for sending an error
        if (!err) {
            var message =  {
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            };
        } else {
            var message = {
                timestamp: Date.now(),
                pid: process.pid,
                error: err.message
            };
        }
        rep.send(JSON.stringify(message));
    });
});

rep.bind("tcp://127.0.0.1:5433", function() {
    console.log("Listening to connections...");
});

process.on('SIGINT', function () {
    console.log("Closing connections.");
    rep.close();
});