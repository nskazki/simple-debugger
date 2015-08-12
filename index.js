'use strict';

exports.debugMethods = check('debugMethods')
    ? require('./debuggers/debugMethods')
    : require('lodash').noop

exports.debugEvents = check('debugEvents')
    ? require('./debuggers/debugEvents')
    : require('lodash').noop

function check(name) {
  var debugFlag = process.env.DEBUG || ''
  var namespace = debugFlag.replace(/\*/g, '.*?')
  var regExp = new RegExp('^' + namespace + '$')
  return regExp.test(name)
}
