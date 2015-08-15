'use strict';

const fs  = require('fs'),
      zmq = require('zmq');

const publisher = zmq.socket('pub'),
      filename  = process.argv[2],
      watch     = fs.watch(filename);

watch.on('change', function () {
    publisher.send(JSON.stringify({
        type: 'changed',
        file: filename,
        timestamp: Date.now()
    }));
});

publisher.on('accept', function (fd, ep) {
    console.log("Connection accepted.");
})

publisher.on('listen', function(fd, ep) {
    console.log("Listening to connections...");
})

publisher.monitor(500, 0);

publisher.bind('tcp://*:5432');