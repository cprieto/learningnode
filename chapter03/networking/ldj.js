'use strict';
const events = require('events'),
      util   = require('util');

const LDJClient = function (stream) {
    events.EventEmitter.call(this);
    var buffer = '', self = this;
    stream.on('data', function(data) {
        buffer += data;
        var boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
            let input = buffer.substr(0, boundary);
            buffer = buffer.substr(boundary + 1);
            self.emit('message', JSON.parse(input));
            boundary = buffer.indexOf('\n');
        }
    });
};

util.inherits(LDJClient, events.EventEmitter);