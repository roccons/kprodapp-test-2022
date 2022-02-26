'use strict'

function formatMessage(message, align) {
  const class1 = align === 'left' ? '' : 'text-center'
  const class2 = `spinner-box${align === 'left' ? ' text-right' : ''}`

  message = message || 'La información se está actualizando...<br>Espera por favor.'
  message = `<div class="${class1}">${message
    }<br>&nbsp;<div class="${class2}"><span class="spinner-lg active"></span></div></div>`

  return message
}


function modalSpinner(message, align) {

  const options = {
    buttons: null,
    closeOnEsc: true,
    allowClose: false,
  }

  return App.ui.dialog(formatMessage(message, align), options)
}


modalSpinner.adopt = function adopt(alert, message, align) {
  if (!alert) {
    return modalSpinner(message, align)
  }

  return alert.waitState(formatMessage(message, align), null, true)
}


module.exports = modalSpinner
