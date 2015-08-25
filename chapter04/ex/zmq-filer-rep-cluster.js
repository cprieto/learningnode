'use strict';

const zmq     = require('zmq'),
      cluster = require('cluster'),
      fs      = require('fs');

if (cluster.isMaster) {
    const dealer = zmq.socket('dealer'),
          router = zmq.socket('router');

    router.on('message', function () {
        var data = Array.prototype.slice.call(arguments);
        dealer.send(data);
    });

    dealer.on('message', function () {
        var data = Array.prototype.slice.call(arguments);
        router.send(data);
    });

    router.bind('tcp://127.0.0.1:5433');
    dealer.bind('ipc://filer-dealer.ipc');

    cluster.on('online', function (worker) {
        console.log("Worker " + worker.process.pid + " is online.");
    });

    for (let i = 0; i < 3; i++) {
        cluster.fork();
    }

    // Task3: Add support to respawn if worker dies
    cluster.on('exit', function(worker, code, signal) {
        console.log("Worker just died. Restarting...");
        cluster.fork();
    });

} else { // NOTE: This is a worker
    const responder = zmq.socket('rep');

    responder.on('message', function (data) {
        var request = JSON.parse(data);
        console.log("Requested file '" + request.path + "'.");
        fs.readFile(request.path, function (err, content) {
            responder.send(JSON.stringify({
                content  : content.toString(),
                timestamp: Date.now(),
                pid      : process.pid
            }));
        });
    });

    responder.connect('ipc://filer-dealer.ipc');
}