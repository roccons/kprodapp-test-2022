module.exports = function generate(ids) {
  'use strict'

  if (!ids.length) return

  App.ui.yesNo('¿Deseas crear nuevas órdenes a partir de las requisiciones seleccionadas?',
    () => {
      setTimeout(() => {
        const progress = require('helpers/progress-action')
        progress('/requisitions/bulkGenerateOrder', { ids }, 'Generando órdenes de producción...')
      }, 100)
    })
}
