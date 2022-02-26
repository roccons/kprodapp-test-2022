/*
  jQuery plugin for numeric form fields
*/
'use strict'

function onKeyUpID(e) {
  // space=32, '.'=46, '0'=48..'9'=57, ':'=58, DEL=127
  // 36:home, 35:end, 38:up, 40:dn, 8:BS, 46:Supr
  const c = e.keyCode || e.which || e.charCode
  if ((c === 32 || c >= 42) && !(c === 118 || c === 127 || c >= 48 && c <= 57)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function onInputID(e) {
  const v = e.target.value
  const z = v.replace(/\D/g, '')
  if (v !== z) {
    e.preventDefault()
    $(e.target).val(z).change()
  }
}

/**
 * $().onlyDigits
 * Disallows non-digits entry in a form field.
 *
 * @returns {Array} the same jQuery elements
 * @extends jQuery
 */
$.fn.onlyDigits = function () {
  return this.each(function () {
    const _this = this
    if (!hasClass(_this, 'only-digits')) {
      _this.classList.add('only-digits')
      _this.addEventListener('keypress', onKeyUpID, true)
      _this.addEventListener('input',    onInputID, true)
    }
  })
}
