/*
  Get the value for the element.
  Support for multiple fields is only for INPUT type radio.
 */
module.exports = function getValue(fld) { // eslint-disable-line complexity
  'use strict'

  const len  = fld.length
  const type = fld.type || fld[0] && fld[0].type
  let result = ''

  if (type === 'radio') {
    if (fld.type) fld = [fld]
    for (let i = 0; i < len; i++) {
      if (fld[i].checked) {
        result = fld[i].value
        break
      }
    }

  } else if (!fld.type) {
    if (len) throw new Error('getValue no soporta múltiples campos.')
    result = null

  } else if (typeof fld.easySelect == 'function') {
    result = fld.easySelect().getValue()

  } else if (type === 'checkbox') {
    if (fld.checked) result = fld.value || '1'

  } else if (type === 'select-one') {
    const idx = fld.selectedIndex
    if (~idx) result = fld.options[idx].value

  } else if (type === 'select-multiple') {
    const vals = []
    const opts = fld.options
    for (let i = 0; i < len; i++) {
      if (opts[i].selected) vals.push(opts[i].value)
    }
    result = vals.join(',')

  } else if (hasClass(fld.parentNode, 'tokenfield')) {
    result = $(fld).tokenfield('getTokensList', ',', false)

  } else {
    result = fld.value  // text, hidden, file, etc
  }

  return result
}
