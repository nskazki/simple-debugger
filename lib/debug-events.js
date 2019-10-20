'use strict'

const { format } = require('util')

const debug = require('debug')
const smartToString = require('./smart-to-string')

const { toArray } = require('lodash')
const { isString } = require('lodash')
const { isUndefined } = require('lodash')

module.exports = debugEvents

function debugEvents(object, _ignoreList, _objectName) {
  const ignoreList = isUndefined(_ignoreList)
    ? []
    : _ignoreList

  const objectName = isUndefined(_objectName)
    ? genObjectName(object)
    : _objectName

  const eDebug = debug(format('debugEvents:%s', objectName))

  const vanillaEmit = object.emit
  object.emit = function(eventName) {
    if (ignoreList.indexOf(eventName) !== -1) {
      return vanillaEmit.apply(this, arguments)
    }

    const args = toArray(arguments)
      .slice(1)
      .map(smartToString)
      .join(', ')
    const info = isString(args) && (args.length > 0)
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
