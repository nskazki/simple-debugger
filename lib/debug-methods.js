'use strict'

const { format } = require('util')

const debug = require('debug')
const smartToString = require('./smart-to-string')

const { uniq } = require('lodash')
const { keysIn } = require('lodash')
const { concat } = require('lodash')
const { toArray } = require('lodash')
const { isString } = require('lodash')
const { isFunction } = require('lodash')
const { isUndefined } = require('lodash')

module.exports = debugMethods

const blackList = concat(
  Object.getOwnPropertyNames(Object),
  Object.getOwnPropertyNames(Object.prototype))

function debugMethods(object, _ignoreList, _objectName) {
  const ignoreList = isUndefined(_ignoreList)
    ? blackList
    : uniq(concat(_ignoreList, blackList))

  const objectName = isUndefined(_objectName)
    ? genObjectName(object)
    : _objectName

  const mDebug = debug(format('debugMethods:%s', objectName))

  const methods = uniq(concat(
    keysIn(object),
    Object.getOwnPropertyNames(object),
    Object.getOwnPropertyNames(object.__proto__)
  ))

  methods
    .filter((name) => {
      return !isGetterOrSetter(object, name)
    })
    .filter((name) => {
      return isFunction(object[name])
    })
    .filter((name) => {
      return ignoreList.indexOf(name) === -1
    })
    .forEach((name) => {
      const vanillaFunc = object[name]
      object[name] = function() {
        const args = toArray(arguments)
          .map(smartToString)
          .join(', ')

        const info = isString(args) && (args.length > 0)
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
  const ownProps = Object.getOwnPropertyDescriptor(object, name) || {}
  const protoProps = Object.getOwnPropertyDescriptor(object.__proto__, name) || {}

  return isFunction(ownProps.get) || isFunction(ownProps.set)
    || isFunction(protoProps.get) || isFunction(protoProps.set)
}

function genObjectName(object) {
  return object.constructor.name
}
