// DEBUG=* node example/

'use strict'

const { noop } = require('lodash')
const { format } = require('util')
const { inherits } = require('util')

const EventEmitter = require('events')

const { debugEvents } = require('../')
const { debugMethods } = require('../')

// Worker
inherits(Worker, EventEmitter)
function Worker() {
  debugEvents(this)
  debugMethods(this, ['on', 'once', 'emit'])
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
  debugMethods(this, ['on', 'once', 'emit'])

  this.taskQueue = [1]

  this.taskQueue.forEach((task) => {
    setTimeout(() => {
      this.emit('task', format('id-%s', task), task)
    }, 0)
  })
}

Provider.prototype.attachWorker = function(worker) {
  worker.on('success', this.resultHandler.bind(this))
}

Provider.prototype.resultHandler = function(taskId, data) {
  // ...
  noop(taskId, data)
}

// index
const worker = new Worker()
const provider = new Provider()

worker.attachProvider(provider)
provider.attachWorker(worker)
