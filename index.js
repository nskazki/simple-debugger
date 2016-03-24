'use strict';

exports.debugMethods = check('debugMethods')
    ? require('./debuggers/debugMethods')
    : require('lodash').noop

exports.debugEvents = check('debugEvents')
    ? require('./debuggers/debugEvents')
    : require('lodash').noop

exports.debugNgEvents = check('debugNgEvents')
    ? require('./debuggers/debugNgEvents')
    : require('lodash').noop

function check(name) {
  var namespaces = (process.env.DEBUG || '').split(/[\s,]+/);
  return namespaces.some(function(namespace) {
    var escapeNamespace = namespace.replace(/\*/g, '.*?')
    var regExp = new RegExp('^' + escapeNamespace + '$')
    return regExp.test(name)
  })
}
