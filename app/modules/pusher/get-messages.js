const NOTIFIC_LIST = '#notifications-list'
const NOTIFIC_BODY = '#notifications-body'
const NOTIFIC_OPTS = '#notifications-opts'

const userActions  = require('./user-actions')


function actions(evt) {
  const btn = evt.target

  if (hasClass(btn, '-mark-readed')) {

    if (hasClass(btn, 'disabled')) return false
    btn.classList.add('disabled')

    App.server('/userNotifications/viewed/all', 'PATCH')
      .done(res => {
        const ids = res.ids
        if (ids && ids.length) {
          $(NOTIFIC_BODY).find('.list-group-item.unread').each((_, item) => {
            const _id = item.getAttribute('data-id')
            if (~ids.indexOf(_id)) item.classList.remove('unread')
          })
        }
      })
      .fail(xhr => {
        App.ui.toast.error(`Error marcando notificaciones: ${App.server.errStr(xhr)}`)
      })
      .always(() => {
        btn.classList.remove('disabled')
        App.pusher.updateCount()
      })

  } else if (hasClass(btn, '-hide-readed')) {

    const hidden = $(NOTIFIC_LIST).toggleClass('readed-hidden').hasClass('readed-hidden')
    App.config.ls('notif:readed-hidden', hidden)
    App.pusher.updateCount()

  }

  return false
}


function getMessages() {
  const push = App.pusher
  const data = { page: 1, per_page: 250 }

  App.server('/userNotifications', 'GET', { data })
    .done(res => {
      const view  = require('./views/notifications-list.pug')
      const dates = require('scripts/lib/dates')
      const list  = res.data || []

      list.forEach(n => {
        n.created_at = dates.ensureDate(n.created_at)
        n.read_at = n.read_at && dates.ensureDate(n.read_at)
      })

      $(NOTIFIC_LIST).off().replaceWith(view({ list }))

      // re-read, jQuery array is not live
      $(NOTIFIC_LIST).parent().on('show.bs.dropdown', () => {
        $(NOTIFIC_OPTS).removeAttr('style')    // hide sub-options
      })

      // Maneja el click en las notificaciones individuales
      $(NOTIFIC_BODY).dblclick(false)
        .off('click', userActions).click(userActions)

      // Este handler controla los clics en la barra superior del popup,
      // que tiene los botones para ocultar y marcar las notif. leídas.
      $(NOTIFIC_LIST).children('li').first()
        .off('click', actions).click(actions)
        .find('.-show-opts').mouseenter(() => {
          $(NOTIFIC_OPTS).slideDown('fast')
        })

      push.updateCount()
    })
    .fail(xhr => {
      push._initDone = false
      App.server.showError(xhr)
    })
}

window.addEventListener('online', getMessages, false)

module.exports = getMessages
