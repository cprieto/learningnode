'use strict';

const net       = require('net'),
      ldj       = require('./ldj.js'),
      netClient = net.connect({port: 5432}),
      ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {
    if (message.type == "watch") {
        console.log("Watching file '" + message.file + "'.");
    } else if (message.type == "changed") {
        console.log("File '" + message.file + "' has changed on " + new Date(message.timestamp));
    } else {
        throw new Error("Not recognized message type!");
    }
});
