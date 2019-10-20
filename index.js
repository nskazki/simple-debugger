'use strict'

const { noop } = require('lodash')
const { trim } = require('lodash')

const debugEvents = require('./lib/debug-events')
const debugMethods = require('./lib/debug-methods')

exports.debugEvents = check('debugEvents') ? debugEvents : noop
exports.debugMethods = check('debugMethods') ? debugMethods  : noop

function check(name) {
  var namespaces = trim(process.env.DEBUG).split(/[\s,]+/)
  return namespaces.some(function(namespace) {
    var escapeNamespace = namespace.replace(/\*/g, '.*?')
    var regExp = new RegExp('^' + escapeNamespace + '$')
    return regExp.test(name)
  })
}
