'use strict'

const { format } = require('util')
const { inspect } = require('util')

const { isNull } = require('lodash')
const { isObject } = require('lodash')
const { isUndefined } = require('lodash')

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
