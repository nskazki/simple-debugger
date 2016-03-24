'use strict';

module.exports = debugNgEvents

var smartToString = require('../tools/smartToString')
var isUndefined = require('lodash').isUndefined
var debug = require('debug')
var format = require('util').format
var toArray = require('lodash').toArray
var isNumber = require('lodash').isNumber

function debugNgEvents(object, _ignoreList, _objectName) {
  var ignoreList = isUndefined(_ignoreList)
    ? []
    : _ignoreList
  var scopeId = isNumber(object.$id)
    ? format('[%s]', object.$id)
    : ''
  var objectName = isUndefined(_objectName)
    ? object.constructor.name + scopeId
    : _objectName

  var eDebug = debug(format('debugNgEvents:%s', objectName))

  var vanillaEmit = object.$emit
  object.$emit = function(eventName) {
    if (!~ignoreList.indexOf(eventName) && object === this) {
      var args = toArray(arguments)
        .slice(1)
        .map(smartToString)
        .join(', ')
      if (args) eDebug('!%s - %s', eventName, args)
      else eDebug('!%s', eventName)
    }
    return vanillaEmit.apply(this, arguments)
  }

  var vanillaBroadcast = object.$broadcast
  object.$broadcast = function(eventName) {
    if (!~ignoreList.indexOf(eventName) && object === this) {
      var args = toArray(arguments)
        .slice(1)
        .map(smartToString)
        .join(', ')
      if (args) eDebug('$%s - %s', eventName, args)
      else eDebug('!!%s', eventName)
    }
    return vanillaBroadcast.apply(this, arguments)
  }
}
