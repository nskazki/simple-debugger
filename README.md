# simple-debugger

```js
var debugEvents = require('simple-debugger').debugEvents
var debugMethods = require('simple-debugger').debugMethods

var EventEmitter = require('events')
var inherits = require('util').inherits

inherits(SomeClass, EventEmitter)
function SomeClass() {
    debugEvents(this)
    debugMethods(this, [ 'on', 'once', 'emit' ])
    this.init()
}

SomeClass.prototype.init = function() {
    //...
    this.emit('inited')
}

new SomeClass()

/*
    $ DEBUG=* node .
      debugMethods:SomeClass #init +0ms
      debugEvents:SomeClass !inited +2ms
*/

```

```js
var debugEvents = require('simple-debugger').debugEvents
var debugMethods = require('simple-debugger').debugMethods

var request = require('request')
var google = request('https://google.com')

debugEvents(google, [], 'google')
debugMethods(google, [ 'on', 'once', 'emit' ], 'google')
```
