/*
  Set the selected value, option or checked state for form controls
  and trigger an event change if neccesary.
  Supported controls:

  INPUT of type:
    hidden
    text
    seach
    tel
    url
    email
    password
    date
    datetime
    datetime-local
    time
    month
    week
    number
    range
    color
    file
    submit
    button
    image
    reset
  SELECT
  TEXTAREA

  Support for multiple fields is only for INPUT type radio.

  Unsupported types in Chrome and Opera:
    search, datetime (but has support for datetime-local)
  Unsupported types in Firefox:
    search, date, datetime, datetime-local, month, week, time

 */
const DATE_TYPES = /^(?:date.*|time|month|week)$/
const _trigger   = require('scripts/lib/triggerEvent')

module.exports = function setValue(fld, val) {   // eslint-disable-line complexity
  'use strict'

  let len  = typeof fld.length == 'number' ? fld.length : -1
  let evt
  const type = fld.type || len > -1 && fld[0].type
  const vnew = typeof val == 'string' ? val : val == null ? '' : String(val)

  if (!type) {
    throw new Error('campo ' + (fld.name || 'sin "name"') + ' no tiene "type"')
  }

  if (type === 'radio' || type === 'checkbox') {
    evt = [0, 0]
    if (len < 1) {
      len = 1
      fld = [fld]
    }
    while (--len >= 0) {
      val = fld[len].value === vnew
      if (val !== fld[len].checked) {
        fld[len].checked = val
        evt[val ? 1 : 0] = len + 1
      }
    }
    evt = evt[1] || evt[0] || 0
    if (evt) fld = fld[evt - 1]

  } else if (type === 'select-one') {
    val = fld.selectedIndex
    while (--len >= 0 && fld[len].value !== vnew);
    if (val !== len) {
      fld.selectedIndex = len
      evt = true
    }

  } else if (type === 'select-multiple') {
    evt = true
    if (Array.isArray(val)) {
      while (--len >= 0) {
        fld[len].selected = val.indexOf(fld[len].value) > -1
      }
    } else {
      while (--len >= 0) {
        fld[len].selected = fld[len].value === vnew
      }
    }

  } else {

    // other fields with no length support
    if (len > 1) {
      throw new Error('setValue no soporta múltiples campos.')
    }

    if (val instanceof Date && DATE_TYPES.test(type)) {
      evt = fld.value
      try {
        fld.valueAsDate = val
      } catch (_) {
        fld.value = val.toISOString().replace('T', ' ')
      }
      evt = evt !== fld.value

    } else {  // text, hidden, file, etc
      evt = fld.value
      fld.value = vnew
      evt = evt !== fld.value
    }
  }

  if (evt) _trigger(fld, 'change')
}
