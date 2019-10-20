'use strict'

var { format } = require('util')

var debug = require('debug')
var smartToString = require('./smart-to-string')

var { uniq } = require('lodash')
var { keysIn } = require('lodash')
var { concat } = require('lodash')
var { toArray } = require('lodash')
var { isString } = require('lodash')
var { isFunction } = require('lodash')
var { isUndefined } = require('lodash')

module.exports = debugMethods

var blackList = concat(
  Object.getOwnPropertyNames(Object),
  Object.getOwnPropertyNames(Object.prototype))

function debugMethods(object, _ignoreList, _objectName) {
  var ignoreList = isUndefined(_ignoreList)
    ? blackList
    : uniq(concat(_ignoreList, blackList))

  var objectName = isUndefined(_objectName)
    ? genObjectName(object)
    : _objectName

  var mDebug = debug(format('debugMethods:%s', objectName))

  var methods = uniq(concat(
    keysIn(object),
    Object.getOwnPropertyNames(object),
    Object.getOwnPropertyNames(object.__proto__)
  ))

  methods
    .filter(function(name) { return !isGetterOrSetter(object, name) })
    .filter(function(name) { return isFunction(object[name]) })
    .filter(function(name) { return !~ignoreList.indexOf(name) })
    .forEach(function(name) {
      var vanillaFunc = object[name]
      object[name] = function() {
        var args = toArray(arguments)
          .map(smartToString)
          .join(', ')

        var info = isString(args) && (args.length > 0)
          ? format('#%s - %s', name, args)
          : format('$%s', name)

        object === this
          ? mDebug(info)
          : mDebug('{ from %s } %s', genObjectName(this), info)

        return vanillaFunc.apply(this, arguments)
      }
    })
}

function isGetterOrSetter(object, name) {
  var ownProps = Object.getOwnPropertyDescriptor(object, name) || {}
  var protoProps = Object.getOwnPropertyDescriptor(object.__proto__, name) || {}

  return isFunction(ownProps.get) || isFunction(ownProps.set)
    || isFunction(protoProps.get) || isFunction(protoProps.set)
}

function genObjectName(object) {
  return object.constructor.name
}
