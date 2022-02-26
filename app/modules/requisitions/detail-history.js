const versionStr = require('scripts/get-version-str')

const EVT = require('./evt_ids.json')

const ACTION_DICT = {
  field_update: 'cambió',
  property_delete: 'eliminó',
  teams_update: 'actualizó'
}

const FIELD_DICT = {
  order_id: 'el ID de la orden',
  location_key: 'la clave de localización',
  resource_version_id: 'la versión',
  resource_title: 'el título del recurso',
  responsible_str: 'el productor responsable',
  reviewed_by_str: 'el revisor',
  assigned_editor_str: 'el editor asignado',
  due_date: 'la fecha de entrega',
  status: 'el estatus',
  visible_for_student: 'la visibilidad para el alumno',
  visible_for_parent: 'la visibilidad para el padre',
  visible_for_coach: 'la visibilidad para el coach',
  minimum_age: 'la edad mínima',
  maximum_age: 'la edad mínima'
}

function beautify(name) {
  return name.split('_')
    .map(s => s[0].toUpperCase() + s.slice(1)).join(' ')
}

function getFieldName(item) {
  const  name = item.field_name

  if (!name.indexOf('requisition_properties.')) {
    return `la propiedad adicional "${beautify(name.split('.').pop())}"`
  }

  return FIELD_DICT[name] || beautify(name)
}

function _qt(tags) {
  return tags && tags.map && tags.map(t => t.name).join(', ')
}

function updateHistory() {
  const dates = require('scripts/lib/dates')
  const view  = require('./views/detail-history.pug')
  const src   = this.versions || []

  // changed the name "history" to avoid conflict with window.history
  const versionList = []

  //eslint-disable-next-line complexity
  src.forEach(item => {
    const sAct = ACTION_DICT[item.action_type] || 'cambió'
    const name = item.field_name
    if (['responsible', 'reviewed_by', 'assigned_editor'].includes(name)) {
      return
    }

    let newVal = name === 'quicktags' ? _qt(item.new_value) : item.new_value
    let oldVal = name === 'quicktags' ? _qt(item.field_value) : item.field_value
    let action = `${oldVal == null && name !== 'status' ? 'agregó' : sAct} ${getFieldName(item)}`


    if (name === 'status') {
      const nameFromId = App.catalogs.nameFromId

      if (item.action_type === 'CC') {
        action = 'completó esta requisición'
      } else {
        if (oldVal) action += ` de "${nameFromId('req_statuses', oldVal)}"`
        if (newVal) action += ` a "<i>${nameFromId('req_statuses', newVal)}</i>"`
        else action += ' a ""'
      }
      oldVal = newVal = undefined

    } else if (name === 'resource_version_id') {
      oldVal = oldVal ? versionStr(oldVal) : undefined
      newVal = newVal ? versionStr(newVal) : undefined
      if (item.action_type === 'field_update' && !item.approved) {
        action = 'solicitó un cambio de versión'
      } else if (item.action_type === 'version_approve') {
        action = 'aprobó el cambio de versión'
      } else if (item.action_type === 'version_reject') {
        action = 'rechazó el cambio de versión'
      }

    } else if (name === 'due_date') {
      newVal = newVal && dates.dateFormat(newVal) || 'fecha en blanco'
      oldVal = oldVal && dates.dateFormat(oldVal) || 'fecha en blanco'

    } else if (/^visible_/.test(name)) {
      const vals = ['No visible', 'Visible']
      oldVal = vals[~~oldVal]
      newVal = vals[~~newVal]

    } else if (/_age$/.test(name)) {
      action += ` de ${~~oldVal} a ${~~newVal}`
      oldVal = newVal = undefined
    } else if (name === 'order') {
      action = 'canceló la orden de producción con ID ' + oldVal
      oldVal = newVal = undefined
    }

    // Las entradas son agrupadas por version_number
    const number = item.version_number
    let version = versionList.find(v => v.number === number)
    if (!version) {
      const date = dates.dateTimeFormat(item.created_at, ', ')
      version = { user_id: item.user_id, user_name: item.user_name, number, date, entries: [] }
      versionList.push(version)
    }
    version.entries.push({ action, oldVal, newVal })
  })

  $('#detail-history').html(view({ versionList }))

}


function doReadHistory() {
  //
  App.server(`/requisitions/${this.id}/versionHistory`)
    .then(
      (res) => {
        this.versions = res || []
        this.trigger(EVT.HISTORY_UPDATED)
      },
      () => {
        App.ui.toast.warning('El historial está desfasado, recarga la página por favor.')
      }
    )
}


module.exports = function (ctx) {

  const fields = App.config.REQ_SPECS_FIELDS.reduce((o, sf) => {
    o[sf.name] = sf.translation
    return o
  }, {})

  assign(FIELD_DICT, fields)

  ctx
    .on(EVT.MODULE_STARTED,     updateHistory)
    .on(EVT.HISTORY_UPDATED,    updateHistory)
    .on(EVT.STATUS_UPDATED,     doReadHistory)
    //.on(EVT.NEED_READ_HISTORY,  doReadHistory)

}
