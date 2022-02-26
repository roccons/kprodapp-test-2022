const notification = require('./views/notification.pug')

module.exports = function onNotific(data) {
  const dates  = require('scripts/lib/dates')

  data.created_at = data.created_at && dates.ensureDate(data.created_at)
  data.read_at    = data.read_at    && dates.ensureDate(data.read_at)

  $('#notifications-body').prepend(notification({ item: data }))

  const model = data.data
  if (model) {
    const orderId = model.model_type === 'order' && model.model_id ||
      model.url != null && ~model.url.indexOf('/orders/') && ~~model.url.split('/').pop()
    if (orderId) {
      App.trigger(App.EVT.KN_NOTIF, 'new', orderId, data)
    }
  } else {
    console.error('notificación recibida sin data')
  }

  App.pusher.updateCount()
}
