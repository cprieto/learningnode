'use strict';

const net    = require('net'),
      client = net.connect({port: 5432});

client.on('data', function(data) {
    var message = JSON.parse(data);
    if (message.type == "watch") {
        console.log("Server is watching '" + message.file + "'");
    } else if (message.type == "changed") {
        let date = new Date(message.timestamp);
        console.log("File '" + message.file + "' changed in server at " + date);
    } else {
        console.log("ERROR: unrecognized message of type '" + message.type + "'.");
    }
});

client.on('close', function() {
    console.log('Server disconnected.');
});