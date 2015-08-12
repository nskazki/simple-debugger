'use strict';

module.exports = debugMethods

var smartToString = require('../tools/smartToString')
var keysIn = require('lodash').keysIn
var isUndefined = require('lodash').isUndefined
var isFunction = require('lodash').isFunction
var debug = require('debug')
var format = require('util').format
var toArray = require('lodash').toArray

function debugMethods(object, _ignoreList, _objectName) {
	var ignoreList = isUndefined(_ignoreList)
		? []
		: _ignoreList
	var objectName = isUndefined(_objectName)
		? object.constructor.name
		: _objectName
	var mDebug = debug(format('debugMethods:%s', objectName))

	keysIn(object)
		.filter(function(name) { return isFunction(object[name]) })
		.filter(function(name) { return !~ignoreList.indexOf(name) })
		.forEach(function(name) {
			var vanillaFunc = object[name]
			var patchFunc = function() {
				var args = toArray(arguments)
					.map(smartToString)
					.join(', ')
				if (args.length) mDebug('#%s - %s', name, args)
				else mDebug('#%s', name)
				return vanillaFunc.apply(object, arguments)
			}
			object[name] = patchFunc
		})
}
