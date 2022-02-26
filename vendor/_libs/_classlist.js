/*
 * HTMLElement.classList normalization
 *
 * 2015-05-07 by aMarCruz
 * lighter code with support for IE9+ and modern browsers only.
 *
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 * See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

;(function () {
  'use strict'

  var testElement = document.createElement('_')
  var classList   = testElement.classList

  if (classList) {

    // There is full or partial native classList support, so just check
    // if we need to normalize the add/remove and toggle APIs.
    var DP = DOMTokenList.prototype
    var c1 = 'c1'
    var c2 = 'c2'

    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    classList.add(c1, c2)

    if (!classList.contains(c2)) {
      var createMethod = function (method) {
        var _oldFn = DP[method]

        DP[method] = function () {
          var args = arguments

          for (var i = 0; i < args.length; i++) {
            _oldFn.call(this, args[i])
          }
        }
      }
      createMethod('add')
      createMethod('remove')
    }

    // Polyfill for IE 10 and Firefox <24, where classList.toggle does
    // not support the second argument.
    classList.toggle(c1, true)

    if (!classList.contains(c1)) {
      (function (P) {
        var _toggle = P.toggle

        P.toggle = function (token, force) {
          if (1 in arguments && this.contains(token) === !!force) {
            return !!force
          }
          return _toggle.call(this, token)
        }
      })(DP)
    }

  } else {
    throw new Error('classList is not supported')
  }

  testElement = 0

})()
