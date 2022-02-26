
function ajaxError(xhr) {
  App.error(App.server.errStr(xhr))
}

/*
  Ejecutado al hacer clic en el cuerpo de la requisición.
  Cualquier clic fuera de un icono marca la notificación
  como leída y abre el link.
*/

module.exports = function userActions(jqev) {
  const btn   = jqev.target
  const $item = $(btn).closest('.list-group-item')
  const ids   = $item.data('id')

  if (ids) {
    const $actions = $item.find('.actions')

    if ($actions.hasClass('disabled')) return false

    if (hasClass(btn, '-delete')) {
      $item.slideUp('fast')
      $actions.addClass('disabled')
      App.server(`/userNotifications/${ids}`, 'DELETE')
        .fail(xhr => {
          $item.slideDown('fast')
          ajaxError(xhr)
        })
        .always(() => {
          $actions.removeClass('disabled')
        })
      return false
    }

    if ($item.hasClass('unread')) {
      $item.addClass('unread')
      $actions.addClass('disabled')
      App.server(`/userNotifications/${ids}/viewed`, 'PATCH')
        .fail(xhr => {
          $item.removeClass('unread')
          ajaxError(xhr)
        })
        .always(() => {
          $actions.removeClass('disabled')
        })
    }

  }

  return !hasClass(btn, '-toggle')
}
