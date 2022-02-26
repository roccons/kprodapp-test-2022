/*
  Ventana de progreso de llamada a endpoint.
  Para usarse en las acciones por lote (bulk) de los páneles.
*/
'use strict'

const NAMES = {
  orders: ['órdenes', 'orden'],
  requisitions: ['requisiciones', 'requisición'],
  excluded: ['excluídas', 'excluida'],
  boards: ['órdenes', 'orden'],
}

/*
  Devuelve la candena genérica de éxito a partir del response.
*/
function successStr(res) {
  if (res.message && res.message.slice(-1) !== '.') {
    res.message += '.'
  }
  const excluded = res.excluded
  if (!excluded) return res.message || res

  const name = NAMES[document.section]
  const i = excluded !== 1 ? 0 : 1
  return `${res.message}<br>${excluded} ${name[i]} ${NAMES.excluded[i]}.`
}

/*
  Crea y muestra el modal, o sustityue el contenido del modal anterior.
*/
function showDialog(_message, $dlg) {
  const dialogView  = require('./progress-action.pug')
  const tmpl = dialogView({ _message })

  if ($dlg) {
    const body = $(tmpl).find('.modal-content').html()
    $dlg.find('.modal-content').fadeOut(200, function () {
      $(this).empty().html(body).fadeIn(200)
    })
  } else {
    const createModal = require('scripts/create-modal')
    $dlg = createModal(0, tmpl).modal() // sin backdrop static
  }

  return $dlg.modal('lock').addClass('waitstate')
}

/**
 * Envía una petición a un endpoint y muestra un diálogo de progreso con
 * el mensaje dado.
 * Opcionalmente el mensaje se puede copiar desde otro diálogo.
 *
 * @param  {string} url - El url del endpoint a enviar por medio de App.server
 * @param  {object} [data] - Datos del endpoint, si es falsy usa undefined
 * @param  {string} [message] - Mensaje a mostrar en el diálogo
 * @param  {object} [$src] - Otro diálogo jQuery a usar como marco.
 * @param  {Function} [cb] - Sucess callback
 */
module.exports = function progressAction(url, data, message, $src, cb) {

  const $dlg = showDialog(message, $src)

  setTimeout(() => {
    App.server(url, 'POST', data ? { data } : undefined)
      .always(() => {
        $dlg.modal('unlock').removeClass('waitstate')
        $dlg.find('.progress').fadeOut('fast', () => {
          $(this).remove()
          $dlg.find('.hidden-box').slideDown()
        })
      })
      .done(res => {
        const message = successStr(res)
        //$dlg.modal('hide')
        $dlg.find('.modal-message').fadeOut(200, function () {
          $(this).html(message).fadeIn(200)
        })
        if (cb) cb(res)
        else App.refreshTables()
      })
      .fail(xhr => {
        $dlg.find('.modal-message').html(App.server.errStr(xhr))
      })
  }, 0)
}
