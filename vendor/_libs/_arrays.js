/*
  Array find polyfill (IE10 don't has it)
*/
;(function (AP) {     // eslint-disable-line no-extra-semi
  'use strict'

  var _def = function (name, fn) {
    Object.defineProperty(AP, name, { value: fn, configurable: true })
  }

  if (!AP.find) {
    _def('find',
      function (cb) {
        if (this == null) {
          throw new TypeError('Array.prototype.find called on null or undefined')
        }
        if (typeof cb != 'function') {
          throw new TypeError('predicate must be a function')
        }
        var list  = Object(this)
        var len   = list.length >>> 0
        var that  = arguments[1]

        for (var ix = 0; ix < len; ix++) {
          if (cb.call(that, list[ix], ix, list)) return list[ix]
        }
        return undefined
      }
    )
  }


  if (!AP.findIndex) {
    _def('findIndex',
      function (cb) {
        if (this == null) {
          throw new TypeError('Array.prototype.findIndex is null or not defined')
        }
        if (typeof fn != 'function') {
          throw new TypeError('predicate must be a function')
        }
        var list  = Object(this)
        var len   = list.length >>> 0
        var that  = arguments[1]
        var ix = -1
        while (++ix < len) {
          if (cb.call(that, list[ix], ix, list)) return ix
        }
        return -1
      }
    )
  }


  if (!AP.includes) {
    _def('includes',
      function(searchElement, fromIndex) {
        var list  = Object(this)
        var len   = list.length >>> 0

        if (len > 0) {
          var ix = fromIndex | 0
          if (ix < 0) {
            if (ix += len < 0) ix = 0
          }
          var currentElement
          while (ix < len) {
            currentElement = list[ix]
            if (searchElement === currentElement ||
              (searchElement !== searchElement && currentElement !== currentElement)) {
              return true
            }
            ix++
          }
        }
        return false
      }
    )
  }

})(Array.prototype)
