'use strict'

var { format } = require('util')

var debug = require('debug')
var smartToString = require('./smart-to-string')

var { toArray } = require('lodash')
var { isString } = require('lodash')
var { isUndefined } = require('lodash')

module.exports = debugEvents

function debugEvents(object, _ignoreList, _objectName) {
  var ignoreList = isUndefined(_ignoreList)
    ? []
    : _ignoreList

  var objectName = isUndefined(_objectName)
    ? genObjectName(object)
    : _objectName

  var eDebug = debug(format('debugEvents:%s', objectName))

  var vanillaEmit = object.emit
  object.emit = function(eventName) {
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
}

function genObjectName(object) {
  return object.constructor.name
}
