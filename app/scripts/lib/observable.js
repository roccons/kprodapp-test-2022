/*
    Riot-observable

    https://github.com/riot/observable

    The name 'evt' in parameters is used instead 'events' to
    avoid confusing with the 'window.event' object.

 */
//#set _TRAP_ERRORS 1

// Methods on closure avoids dinamyc creation of new functions.
// These will be attached to objects with bind().

/**
 * Listen to the given `event` and exectutes the `callback`
 * each time the given event is triggered.
 *
 * @param   {String}    evt - Event id
 * @param   {Function}  fn  - The callback function
 * @returns {Object}    `this` chainable object.
 */
function _on(evt, fn) {

//#if _TRAP_ERRORS
  if (evt == null) {
    throw new Error('observable: Must give an event name')
  }
//#endif

  if (typeof fn == 'function') {
    (this._callbacks[evt] || (this._callbacks[evt] = [])).push(fn)
  }

  return this
}

/**
 * Listen to the given `event` and exectutes the `callback`
 * at most once when the given event is triggered.
 *
 * @param   {String}    evt - Event id
 * @param   {Function}  fn  - The callback function
 * @returns {Object}    `this` chainable object.
 */
function _one(evt, fn) {

  function __on() {
    this.off(evt, __on)
    fn.apply(this, arguments)
  }

  return this.on(evt, __on)
}

/**
 * Removes the given space delimited list of `event` listeners.
 *
 * @param   {String}   events - List of event ids
 * @param   {Function} fn     - The callback function
 * @returns {Object}   `this` chainable object
 */
function _off(events, fn) {
  let evts                // here to avoid transpiller trick

//#if _TRAP_ERRORS
  if (arguments.length && events == null) {
    throw new Error('observable.off: Must give an event name')
  }
//#endif

  if (events && fn) {
    // removes the specific callback for the given events
    evts = events.split(' ')

    for (let i = 0; i < evts.length; i++) {
      const callbacks = this._callbacks[evts[i]]
      let n = callbacks ? callbacks.length : 0

      while (--n >= 0) {
        if (callbacks[n] === fn) callbacks.splice(n, 1)
      }
    }

  } else if (events) {
    // no fn, delete all the callbacks for the given events
    evts = events.split(' ')

    for (let i = 0; i < evts.length; i++) {
      delete this._callbacks[evts[i]]
    }

  } else {
    // no parameters, delete all the callback for all events
    this._callbacks = {}
  }

  return this
}

/**
 * Execute all callback functions that listen to the given `event`.
 *
 * @param   {String} event - Event id
 * @returns {Object} `this` chainable object
 */
function _trigger(event) {

//#if _TRAP_ERRORS
  if (event == null) {
    throw new Error('observable.trigger: Must give an event name')
  }
//#endif

  let cbs1 = this._callbacks[event]
  let cbs2 = event !== '*' && this._callbacks['*']

  // slice callbacks, in practical fact makes them "immutable"
  if (cbs1 && cbs1.length) {
    cbs1 = cbs1.slice(0)
    cbs2 = cbs2 && cbs2.length ? cbs2.slice(0) : []
  } else if (cbs2 && cbs2.length) {
    cbs1 = 0
    cbs2 = cbs2.slice(0)
  } else {
    return this
  }

  // slice args using cbs2 to avoid slice closure
  const args = cbs2.slice.call(arguments, 1)

  setImmediate(__trigger, this, args, event, cbs1, cbs2)

  return this
}

/**
 * Helper for callback execution
 *
 * @param {Object} elem - The elem which the event is triggered on
 * @param {Array}  args - The arguments, not including the event name
 * @param {String} name - The event name for calling cbs2
 * @param {Array}  cbs1 - Specific (named) callback funcions
 * @param {Array}  cbs2 - Callbacks for all events ('*')
 */
function __trigger(elem, args, name, cbs1, cbs2) {

  if (cbs1) {
    // does not send the event name to named callbacks
    for (let i = 0; i < cbs1.length; i++) {
      const fn = cbs1[i]

      // set the _busy flag to avoid recursion
      if (fn._busy) continue
      fn._busy = 1
      try {
        if (fn.apply(elem, args) === false) {
          return
        }
      // finally here let throws any exception,
      // but ensures the _busy flag is restored
      } catch (e) {
        throw e
      } finally {
        fn._busy = 0
      }
    }
  }

  if (cbs2) {
    // name is sended to callbacks type '*'
    args.unshift(name)

    for (let i = 0; i < cbs2.length; i++) {
      const fn = cbs2[i]

      if (fn._busy) continue
      fn._busy = 1
      try {
        if (fn.apply(elem, args) === false) {
          return
        }
      } finally {
        fn._busy = 0
      }
    }
  }
}

/*
  * ======================================================
  * Public API
  * ------------------------------------------------------
  */

module.exports = function observable(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */
  if (!el) el = {}

  // extend the object adding the observable methods
  Object.defineProperties(el, {

    _callbacks: {
      value: {}
    },

    on: {
      value: _on.bind(el)
    },

    off: {
      value: _off.bind(el)
    },

    one: {
      value: _one.bind(el)
    },

    trigger: {
      value: _trigger.bind(el), configurable: true
    }

  })

  return el

}
