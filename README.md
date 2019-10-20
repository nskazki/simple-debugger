# SimpleDebugger

A simple way to debug events and methods of your classes.

```
yarn add simple-debugger
```

```js
const { inherits } = require('util')
const { debugEvents } = require('simple-debugger')
const { debugMethods } = require('simple-debugger')

const EventEmitter = require('events')

inherits(SomeClass, EventEmitter)
function SomeClass() {
  debugEvents(this)
  debugMethods(this, [ 'on', 'once', 'emit' ])
  this.init()
}

SomeClass.prototype.init = function() {
  //...
  this.emit('ready')
}

new SomeClass()

/* $ DEBUG=debugEvents*,debugMethods* node .
   debugMethods:SomeClass #init +0ms
   debugEvents:SomeClass !inited +2ms
*/

```

```js
const { debugEvents } = require('simple-debugger')
const { debugMethods } = require('simple-debugger')

const request = require('request')
const google = request('https://google.com')

debugEvents(google, [], 'google')
debugMethods(google, [ 'on', 'once', 'emit' ], 'google')

/* $ DEBUG=debugEvents*,debugMethods* node .
   debugMethods:google $end +0ms
   debugMethods:google $start +0ms
   debugEvents:google !request - [ClientRequest] +0ms
   debugEvents:google !socket - [TLSSocket] +1ms
   debugMethods:google #onRequestResponse - [IncomingMessage] +349ms
   debugMethods:google #getHeader - host +1ms
   ...
*/
```
