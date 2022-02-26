/*
  Fast String startsWidth & endsWith polyfills
*/
;(function (SP) {       // eslint-disable-line no-extra-semi
  'use strict'

  if (!SP.startsWith) {
    SP.startsWith = function (s) {
      return s && this ? !this.lastIndexOf(s, 0) : false
    }
  }
  if (!SP.endsWith) {
    SP.endsWith = function (s) {
      var self = this
      var n    = s && self ? self.length - s.length : -1
      return n >= 0 && self.lastIndexOf(s, n) === n
    }
  }
})(String.prototype)
