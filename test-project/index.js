'use strict';

var debugEvents = require('../').debugEvents
var debugMethods = require('../').debugMethods

var EventEmitter = require('events')
var inherits = require('util').inherits
var format = require('util').format

// Worker
inherits(Worker, EventEmitter)
function Worker() {
    debugEvents(this)
    debugMethods(this, [ 'on', 'once', 'emit' ])
}

Worker.prototype.attachProvider = function(provider) {
  provider.on('task', this.taskHandler.bind(this))
}

Worker.prototype.taskHandler = function(taskId, data) {
  this.emit('success', taskId, data*data)
}

// Provider
inherits(Provider, EventEmitter)
function Provider() {
    debugEvents(this)
    debugMethods(this, [ 'on', 'once', 'emit' ])

    this.taskQueue = [ 1 ]

    this.taskQueue.forEach(function(task) {
      setTimeout(function() {
        this.emit('task', format('id-%s', task), task)
      }.bind(this), 0)
    }.bind(this))
}

Provider.prototype.attachWorker = function(worker) {
  worker.on('success', this.resultHandler.bind(this))
}

Provider.prototype.resultHandler = function(taskId, data) {
  // ...
}

// index
var worker = new Worker()
var provider = new Provider()

worker.attachProvider(provider)
provider.attachWorker(worker)
