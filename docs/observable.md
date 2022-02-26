# Observable

Observable is a generic tool to send and receive events. It's a common pattern to isolate modules without forming a dependency or *coupling*. By using events a large program can be broken into smaller and simpler units. Modules can be added, removed, or modified without affecting the other parts of the application.

A common practice is to split the application into a single core and multiple extensions. The core sends events any time something remarkable happens: a new item is being added, an existing item is being removed, or something is loaded from the server.

By using the observable the extensions can listen to these events and react to them. They extend the core so that the core is not aware of these modules. This is called *loose coupling*.

These extensions can be custom tags (UI components) or non-UI modules.

Once the core and events are carefully designed the team members are enabled to develop the system on their own without disturbing others.


## API

### <a name="constructor"></a> `observable(el)`

Adds [Observer](http://en.wikipedia.org/wiki/Observer_pattern) support for the given object `el` or, if the argument is empty, a new observable instance is created and returned. After this, the object is able to trigger and listen to events.

**Example:**

```js
function Car() {

  // Make Car instances observable
  observable(this)

  // listen to 'start' event
  this.on('start', function () {
    // engine started
  })
}

// make a new Car instance
var car = new Car()

// trigger 'start' event
car.trigger('start')
```

Returns the given object `el` or a new observable instance.

### <a name="on"></a> `el.on(events | '*', callback)`

Listen to the given space-separated list of `events` and execute the `callback` each time an event is triggered.

```js
// listen to single event
el.on('start', function () {
  // handle the event 'start'
})

// listen all the events of this observable
el.on('*', function (eventName, param1, param2) {
  // eventName will be the name of any event triggered
  // do something with the rest of parameters
})
```

Returns `el`, so you can chain calls.

### <a name="one"></a> `el.one(events, callback)`

Listen to the given space-separated list of `events` and execute the `callback` at most once.

```js
// run the function once, even if 'start' is triggered multiple times
el.one('start', function (eventName) {

})

el.trigger('start')     // the callback runs
el.trigger('start')     // the callback is not called anymore
```

Returns: `el`

### <a name="off-fn"></a> `el.off([events | '*' [, fn]])`

Removes the callback `fn` from the list of events.

Note the syntax, if you do not pass the `events` nor the `'*'`, you must omit `fn`.

Passing `'*'` removes callbacks set through `on('*', fn)`.

If you omit `fn` all the callbacks are removed for the given events.

...so we have:

```js
el.off(events, fn)      // removes the callback fn for the given events
el.off(events)          // removes all the callbacks for the given events
el.off('*', fn)         // removes the callback fn set with el.on('*', fn)
el.off('*')             // removes all the callbacks set with el.on('*', fn)
el.off()                // removes all the callbacks for all the events
```

**Example:**

```js
function doIt () {
  console.log('in the event')
}

el.on('start', doIt)
el.on('middle', doIt)
el.on('end', doIt)

// remove a specific listener of 'start' and 'end' events
el.off('start end', doIt)

// removes all the callbacks
el.off()
```

Returns: `el`

### <a name="trigger"></a> `el.trigger(event [, ...args])`

Execute all callback functions that listen to the given `event`.

Any extra parameters are provided to the listener.

Returning `false` from the callback stop the remaining execution.

```js
// listen to 'start' events and expect optional parameters
el.on('start', function (engine_details, is_rainy_day) {
  if (engine_details) {
    // do something with the parameters
  }
})

// trigger the "start" event without parameters
el.trigger('start')

// trigger the "start" event with extra parameters
el.trigger('start', { fuel: 89 }, true)
```

Returns: `el`
