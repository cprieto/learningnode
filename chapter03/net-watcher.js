'use strict';

const net      = require('net'),
      fs       = require('fs'),
      filename = process.argv[2],
      server   = net.createServer();

if (!filename) {
    throw new Error("You need to specify the filename to watch!");
}

server.on('connection', function (connection) {
    console.log("Somebody just connected.");
    var watcher = fs.watch(filename);

    console.log("Watching file '" + filename + "'");

    watcher.on('change', function() {
        console.log("File changed.");
        connection.write("File '" + filename + "' was changed.");
    });

    connection.on('close', function() {
        watcher.close();
    });
});

server.on('listening', function () {
    console.log("Now listening in port 5432...");
});

server.listen(5432);
