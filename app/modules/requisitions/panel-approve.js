module.exports = function generate(ids) {
  'use strict'

  if (!ids.length) return

  const progress = require('helpers/progress-action')

  progress('/requisitions/bulkApproveChanges', { ids }, 'Aprobando cambios...')
}
