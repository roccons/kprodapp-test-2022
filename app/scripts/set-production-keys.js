/*
 * Initialize tokenfields for the productionKeys field.
 */
'use strict'

const PRODKEY_MASK = /[^A-Z0-9_\-]/g
const PRODKEY_TEST = /[^A-Za-z0-9_\-,]/
//const PRODKEY_SIZE = 100

function touppercase(e) {
  const ea = e.attrs
  ea.value = ea.label = ea.label.toUpperCase().replace(PRODKEY_MASK, '').slice(0, 100)
}

function filterKeys(e) {
  const k = e.which || e.keyCode
  // 44=Comma, 48=Digit0, 57=Digit9, 65=KeyA, 90=KeyZ, 97=KeyA, 122=KeyZ, 45=Slash(guión), 95=Slash(bajo)
  //console.log('code: ' + e.code + ', charCode: ' + e.charCode + ', which: ' + k)
  if (k >= 48 && k <= 57 || k === 44) return
  if (k >= 65 && k <= 90 || k >= 97 && k <= 122 || k === 45 || k === 95) return
  e.preventDefault()
}

function filterInput() {
  let text = this.value

  if (text.length > 1) {
    this.value = text = text.replace(/[ \t]+/g, ',')
  }
  if (PRODKEY_TEST.test(text)) {
    this.value = text.replace(PRODKEY_TEST, '')
  }
}

module.exports = function setProductionKeys(el) {

  // initialize the tokenfields
  const $el = $(el).on('tokenfield:createtoken', touppercase)

  $el.tokenfield()

  // iOS 5+ native support for uppercase
  el = $el.tokenfield('getInput')[0]
  if (el.autocapitalize != null) el.autocapitalize = 'characters'
  el.style.textTransform = 'uppercase'

  el.addEventListener('keypress', filterKeys, false)
  el.addEventListener('input', filterInput, true)

  return $el
}
