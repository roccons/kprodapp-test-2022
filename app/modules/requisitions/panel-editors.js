/*
  Opción para asignar editor desde el panel (POST /requisitions/bulkUpdate
    enviando `assigned_editor`).

  Ejemplo de asignación masiva de editores:
  {
  "ids":[5,4],
  "assigned_editor":"5a58de5f-84b4-45af-93ee-f15001705d8a",
  "assigned_editor_str":"Nombre"
  }
*/
'use strict'

function sendForm($dlg, ids) {
  const progress = require('helpers/progress-action')

  const select = $dlg.find('select')[0]
  const assigned_editor = select[select.selectedIndex].value
  const assigned_editor_str = App.catalogs.nameFromId('users', assigned_editor)

  progress(
    '/requisitions/bulkUpdate',
    { ids, assigned_editor, assigned_editor_str },
    'Estableciendo editor...',
    $dlg
  )
}

module.exports = function generate(ids) {
  if (!ids.length) return

  const createModal = require('scripts/create-modal')
  const selectView  = require('./views/panel-editors.pug')

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
