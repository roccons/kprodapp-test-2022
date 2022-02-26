'use strict'

const onUserLogin = require('./on-user-login')

App.pusher = App.store
  .observable({

    updateCount:   require('./update-count'),
    timeFormatter: require('scripts/lib/dates').dateTimeFormat,
    urlFormatter:  require('./url-formatter'),
  })

App.on('user:login',  onUserLogin)
   .on('user:logout', onUserLogout)


setTimeout(onUserLogin, 500)


function onUserLogout() {
  const pusher = App.pusher.instance

  if (pusher) {
    pusher.disconnect()
    App.pusher.instance = false
  }

  App.pusher.updateCount(0)
  App.pusher._initDone = false

  $('#notifications-list').empty()
}
