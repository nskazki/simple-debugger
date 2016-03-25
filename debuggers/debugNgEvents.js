'use strict';

module.exports = debugNgEvents

var smartToString = require('../tools/smartToString')
var isUndefined = require('lodash').isUndefined
var debug = require('debug')
var format = require('util').format
var toArray = require('lodash').toArray
var isNumber = require('lodash').isNumber
var isString = require('lodash').isString

function debugNgEvents(object, _ignoreList, _objectName) {
  var ignoreList = isUndefined(_ignoreList)
    ? []
    : _ignoreList

  var objectName = isUndefined(_objectName)
    ? genObjectName(object)
    : _objectName

  var eDebug = debug(format('debugNgEvents:%s', objectName))

  var vanillaEmit = object.$emit
  object.$emit = function(eventName) {
    if (ignoreList.indexOf(eventName) !== -1)
      return vanillaEmit.apply(this, arguments)

    var args = toArray(arguments)
        .slice(1)
        .map(smartToString)
        .join(', ')
    var info = isString(args) && (args.length > 0)
      ? format('!%s - %s', eventName, args)
      : format('!%s', eventName)

    object === this
      ? eDebug(info)
      : eDebug('{ from %s } %s', genObjectName(this), info)

    return vanillaEmit.apply(this, arguments)
  }

  var vanillaBroadcast = object.$broadcast
  object.$broadcast = function(eventName) {
    if (ignoreList.indexOf(eventName) !== -1)
      return vanillaBroadcast.apply(this, arguments)

    var args = toArray(arguments)
        .slice(1)
        .map(smartToString)
        .join(', ')
    var info = isString(args) && (args.length > 0)
      ? format('!!%s - %s', eventName, args)
      : format('!!%s', eventName)

    object === this
      ? eDebug(info)
      : eDebug('{ from %s } %s', genObjectName(this), info)

    return vanillaBroadcast.apply(this, arguments)
  }
}

function genObjectName(object) {
  var scopeId = isNumber(object.$id)
    ? format('[%s]', object.$id)
    : ''
  return object.constructor.name + scopeId
}
