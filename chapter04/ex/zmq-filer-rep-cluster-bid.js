'use strict';

const zmq     = require('zmq'),
      cluster = require('cluster'),
      fs      = require('fs'),
      util    = require('util');

if (cluster.isMaster) {
    let output        = zmq.socket('push'),
        input         = zmq.socket('pull'),
        ready_workers = 0;

    input.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type == 'ready' && ++ready_workers >= 3) {
            let doWork = {
                type     : 'job',
                timestamp: Date.now()
            };
            output.send(JSON.stringify(doWork));
        } else if (message.type == 'result') {
            console.log('[Result] ', util.inspect(message));
        } else {
            console.log('[Error] Oops, I got an unknown message type!');
        }
    });

    for (let n = 0; n < 3; n++) {
        cluster.fork();
    }

    output.bind('ipc://master-output.ipc');
    input.bind('ipc://master-input.ipc');

} else { // NOTE: This is a worker
    let input  = zmq.socket('pull'),
        output = zmq.socket('push');

    input.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type == 'job') {

            let result = {
                type     : 'result',
                result   : null,
                timestamp: Date.now(),
                pid      : process.pid
            };
            output.send(JSON.stringify(result));
        }
    });

    output.connect('ipc://master-input.ipc');
    input.connect('ipc://master-output.ipc');

    var message = {
        type     : 'ready',
        pid      : process.pid,
        timestamp: Date.now()
    };

    output.send(JSON.stringify(message));
}
