'use strict'

module.exports = function onUserLogin() {
  const store = App.pusher
  if (store._initDone) return

  // pone flag para no ejecutar éste proc más de una vez
  store._initDone = true

  const resetPusher = require('./reset-pusher')
  resetPusher(store, App.user.id)

  const getMessages = require('./get-messages')
  getMessages(store)
}
