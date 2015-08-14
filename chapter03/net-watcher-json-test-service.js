'use strict';

const net    = require('net'),
      server = net.createServer(5432);

server.on('connection', function (connection) {
    console.log("Client connected.");
    connection.write('{"type": "changed", "file": "targ');
    var timer = setTimeout(function () {
        connection.write('et.txt", "timestamp": 1358175758495}' + "\n");
        connection.end();
    }, 1000);
    
    connection.on('end', function() {
        console.log("Client disconnected.");
    });
});

server.listen(5432);
console.log("Listening to connections...");