// Lista de propiedades de la requisición master a copiar a la raíz
const REQ_PROPS = [
  'approved_by_str',
  'challenge',
  'krb_resource_id',
  'grade',
  'location_key',
  'pathway',
  'requested_by_str',
  'resource_tags',
  'session',
  'production_id',
]

module.exports = function preprocRec(data) {
  'use strict'

  const dates = require('scripts/lib/dates')

  // convierte fechas del formato DB a intancias de JS Date
  data.due_date   = dates.dbDateToDate(data.due_date) // recibido como YYYY-MM-DD
  data.created_at = dates.ensureDate(data.created_at) // recibido como fecha-hora

  // los quickTags se manejarán como cadena de tokens separados por comas
  data.quicktags = data.quicktags && data.quicktags.map(t => t.name).join(', ') || ''

  // busca la master_requisition y se asegura que quede en la primer posición
  const req = data.master_requisition
  if (!req.id) {
    const err = `Master requisition no existe en la orden ${data.id}.`
    App.error(err)
    App.ui.toast.error(err)
  } else if (!data.requisitions) {
    data.requisitions = [req]
  } else if (req.id !== data.requisitions[0].id) {
    data.requisitions = [req].concat(data.requisitions.filter(r => r.id !== req.id))
  }

  // copia propiedades de la requisición cero a la raíz
  REQ_PROPS.forEach(p => {
    data[p] = req[p] || ''
  })

  data.master_requisition = req   // para fácil acceso a la requisición master

  // desanida algunas propiedades que el server envía en objetos
  data.resource_type        = req.resource_type && req.resource_type.type || ''
  data.resource_type_group  = req.resource_type_group && req.resource_type_group.name || ''
  data.resource_version     = req.resource_version && req.resource_version.name || ''
  data.responsible_str      = req.responsible_str
  data.classification       = req.classification || 'Curricular'

  return data
}
