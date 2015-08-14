'use strict';

const net      = require('net'),
      fs       = require('fs'),
      filename = process.argv[2],
      server   = net.createServer();

if (!filename) {
    throw new Error("You need to specify the filename to watch!");
}

console.log("Server will watch file '" + filename + "'");

server.on('connection', function (connection) {
    console.log("Somebody just connected.");
    var watcher = fs.watch(filename);

    connection.write(JSON.stringify({
        type: "watch",
        file: filename
    }) + "\n");

    watcher.on('change', function() {
        console.log("File changed.");
        connection.write(JSON.stringify({
            type: "changed",
            file: filename,
            timestamp: Date.now()
        }) + "\n");
    });

    connection.on('close', function() {
        console.log("Client disconnected.");
        watcher.close();
    });
});

server.on('listening', function () {
    console.log("Now listening in port 5432...");
});

server.listen(5432);
