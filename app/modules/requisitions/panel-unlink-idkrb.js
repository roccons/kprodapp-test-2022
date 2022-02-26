'use strict'

const progress = require('helpers/progress-action')

module.exports = function unlik(ids) {
  if (!ids.length) return

  App.ui.confirm(`
      <p>¿Estás seguro que deseas eliminar el ID de resource bank de las siguientes requisiciones?</p>
      </p>${ids.join(', ')}</p>
    `,
    function () {
      progress('/requisitions/bulkUpdate',
        { ids, krb_resource_id: null },
        'Desvinculando recurso de R. bank...'
      )
    }
  )
}
