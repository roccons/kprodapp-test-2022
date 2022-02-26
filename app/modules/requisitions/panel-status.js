/*
  Cambio de status en lote para requisiciones.
*/
'use strict'

function sendForm($dlg, ids) {
  const progress = require('helpers/progress-action')

  const select = $dlg.find('select')[0]
  const status = select[select.selectedIndex].value

  progress(
    '/requisitions/bulkChangeStatus',
    { ids, status },
    'Cambiando status...',
    $dlg
  )
}

module.exports = function generate(ids) {
  if (!ids.length) return

  const createModal = require('scripts/create-modal')
  const selectView  = require('./views/panel-status.pug')

  const $dlg = createModal(0, selectView())
              .on('shown.bs.modal', function () { this.querySelector('select').focus() })
              .modal()

  $dlg.find('select').change(function () {
    $dlg.find('.submit-form').prop('disabled', this.selectedIndex <= 0)
  })

  $dlg.find('.submit-form').click(function () {
    sendForm($dlg, ids)
  })
}
