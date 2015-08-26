'use strict';

const zmq     = require('zmq'),
      cluster = require('cluster'),
      fs      = require('fs'),
      util    = require('util'),
      chance  = require('chance').Chance();

if (cluster.isMaster) {
    let output        = zmq.socket('push'),
        input         = zmq.socket('pull'),
        ready_workers = 0;

    output.bind('ipc://master-output.ipc');
    input.bind('ipc://master-input.ipc');

    input.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type == 'ready' && ++ready_workers >= 3) {
            for (let n = 0; n < 30; n++) {
                let doWork = {
                    type     : 'job',
                    timestamp: Date.now()
                };
                output.send(JSON.stringify(doWork));
            }
        } else if (message.type == 'result') {
            console.log('[Result] ', util.inspect(message));
        }
    });

    for (let n = 0; n < 3; n++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ready: ' + worker.process.pid);
    });

    process.on('SIGINTg', function() {
        output.close();
        input.close();
    });

} else { // NOTE: This is a worker
    let input  = zmq.socket('pull'),
        output = zmq.socket('push');

    output.connect('ipc://master-input.ipc');
    input.connect('ipc://master-output.ipc');

    input.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type == 'job') {
            let result = {
                type     : 'result',
                result   : chance.string(),
                timestamp: Date.now(),
                pid      : process.pid
            };
            output.send(JSON.stringify(result));
        }
    });

    let message = {
        type     : 'ready',
        pid      : process.pid,
        timestamp: Date.now()
    };

    output.send(JSON.stringify(message));
}
