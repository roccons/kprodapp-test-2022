
module.exports = function resetPusher(store, channID) {

  const update = require('./on-pusher-update')
  const notify = require('./on-pusher-notify')
  const Pusher = require('pusher-js')

  //Pusher.logToConsole = true

  if (store.instance) {
    store.instance.disconnect()
  }

  const pusher = new Pusher(App.config.PUSHER_KEY, {
    cluster: 'mt1',
    encrypted: true,
    disabledTransports: ['xhr_streaming', 'xhr_polling']
  })

  store.instance = pusher
  store.errors   = {}

  pusher.connection.bind('error', function (evt) {
    if (!evt) evt = {}

    const data = evt.data || evt.error && evt.error.data || {}
    const code = data.code | 0
    if (code && store.errors[code]) return
    store.errors[code] = true

    const msg = data.message || `error ${code} detectado`
    console.error(`Pusher: ${msg}.`)
  })

  // initialized, connecting, connected, unavailable, failed
  pusher.connection.bind('state_change', function (states) {
    const state = states.current
    const $icon = $('#user-notifications').find('.icon')
    const err = state === 'failed' || state === 'unavailable'
    const cls = state === 'connected' ? 'avatar-online' : err ? 'avatar-away' : 'avatar-off'

    if (err !== $icon.hasClass('fa-bell-slash')) {
      $icon.toggleClass('fa-bell', !err).toggleClass('fa-bell-slash', err)
    }
    App.trigger('user:state-changed', states)
    $('#user-avatar').find('.avatar').removeClass().addClass(`avatar ${cls}`).attr('title', state)
  })

  store.channel = pusher.subscribe(channID)

  store.channel.bind('kprod_event', notify)
  store.channel.bind('notif_read',  update.readed)
  store.channel.bind('notif_removed', update.removed)

  return pusher
}
