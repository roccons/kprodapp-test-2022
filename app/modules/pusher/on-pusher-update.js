/**
 * Handlers del evento Pusher "update" generado al cambiar el estatus
 * "leído" de una notificación (readed) o al borrarla (deleted).
 *
 * Con readed cambia el aspecto del mensaje a "leído".
 * Con removed la notificación se elimina de la lista.
 * En ambos casos el contador de mensajes sin leer es actualizado.
 *
 * @param {object} payload - Incluye el nombre del evento y el id de la notificación
 */
module.exports = {

  removed(payload) {
    const $item = getItem(payload)
    if (!$item) {
      return
    }

    emitEvent('removed', $item)

    if (!$item.queue().length) $item.slideUp('fast')
    $item.queue(function () {
      $item.remove()
      App.pusher.updateCount()
    })
  },

  readed(payload) {
    const $item = getItem(payload)
    if (!$item) {
      return
    }

    emitEvent('readed', $item)

    $item.removeClass('unread')
    App.pusher.updateCount()
  }
}


function getItem(payload) {
  const ids   = payload.data && payload.data.id || payload.id
  const $item = $('#notifications-body').children(`[data-id="${ids}"]`)
  return $item.length ? $item : null
}


function emitEvent(type, $item) {
  const item = $item[0]

  if (item.__emitted) {
    return // solo un evento readed o removed
  }
  item.__emitted = 1

  const orderId = ~~item.dataset.order
  if (orderId) {
    App.trigger(App.EVT.KN_NOTIF, type, orderId)
  }
}
