'use strict';

const zmq     = require('zmq'),
      cluster = require('cluster'),
      fs      = require('fs'),
      util    = require('util');

if (cluster.isMaster) {

} else { // NOTE: This is a worker

}
