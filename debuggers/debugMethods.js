'use strict'

module.exports = debugMethods

var smartToString = require('../tools/smartToString')
var debug = require('debug')
var format = require('util').format

var lodash = require('lodash')
var isUndefined = lodash.isUndefined
var isFunction = lodash.isFunction
var keysIn = lodash.keysIn
var toArray = lodash.toArray
var isString = lodash.isString
var concat = lodash.concat
var uniq = lodash.uniq

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
