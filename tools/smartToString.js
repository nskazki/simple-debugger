'use strict'

module.exports = smartToString

var format = require('util').format
var isObject = require('lodash').isObject
var isUndefined = require('lodash').isUndefined
var isNull = require('lodash').isNull
var inspect = require('util').inspect

function smartToString(object) {
  if (isUndefined(object) || isNull(object)) {
    return '' + object
  } else if (!isObject(object)) {
    return object.toString()
  } else if (object.constructor.name !== 'Object') {
    return format('[%s]', object.constructor.name)
  } else {
    return inspect(object)
  }
}
