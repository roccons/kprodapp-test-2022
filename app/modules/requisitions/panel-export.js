module.exports = function requisExport(ids) {
  'use strict'

  if (!ids.length) return

  const BT_TOOLBAR = '#requisToolbar'
  const downloader = require('scripts/lib/downloader')

  $(BT_TOOLBAR).find('.-export').prop('disabled', true)

  try {
    downloader(App.config.API_BASE + '/requisitions/export?ids[]=' + ids.join('&ids[]='))
    App.ui.toast.success('La exportación está en curso...')
  } catch (e) {
    App.ui.alert('Error al exportar: ' + e)
  }

  setTimeout(() => {
    $(BT_TOOLBAR).find('.-export').prop('disabled', false)
  }, 500)
}
