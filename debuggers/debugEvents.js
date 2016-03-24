'use strict';

module.exports = debugEvents

var smartToString = require('../tools/smartToString')
var isUndefined = require('lodash').isUndefined
var debug = require('debug')
var format = require('util').format
var toArray = require('lodash').toArray

function debugEvents(object, _ignoreList, _objectName) {
	var ignoreList = isUndefined(_ignoreList)
		? []
		: _ignoreList
	var objectName = isUndefined(_objectName)
		? object.constructor.name
		: _objectName

	var vanillaEmit = object.emit
	var eDebug = debug(format('debugEvents:%s', objectName))

	object.emit = function(eventName) {
		if (!~ignoreList.indexOf(eventName)) {
			var args = toArray(arguments)
				.slice(1)
				.map(smartToString)
				.join(', ')
			if (args) eDebug('!%s - %s', eventName, args)
			else eDebug('!%s', eventName)
		}
		return vanillaEmit.apply(object, arguments)
	}
}
