'use strict'

var { format } = require('util')
var { inspect } = require('util')

var { isNull } = require('lodash')
var { isObject } = require('lodash')
var { isUndefined } = require('lodash')

module.exports = smartToString

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
