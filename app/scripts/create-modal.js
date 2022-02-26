module.exports = function createModal(_id, html, el) {
  'use strict'

  const $dlg = $(html)

  if (!_id) _id = $dlg[0].id

  if (_id && getById(_id)) {
    $(_id).modal('close', 'fast').detach()
  }

  return $dlg
    .on('hidden.bs.modal', $.selfRemove)
    .appendTo(el || '#main-page')
}
