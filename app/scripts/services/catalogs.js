'use strict'

/*
  req_statuses:
  Ready to review: cuando el solicitante completa la requisición (es el estatus inicial).
  Canceled: cuando un recurso no será producido (se actualiza manualmente).
  Delayed: cuando un recurso fue solicitado a destiempo (se actualiza manualmente).
  Production - Knotion: cuando la orden de producción fue creada. ***
  Production - Partnership: cuando la orden de producción fue creada. ***
  Production - Outsourcing: cuando la orden de producción fue creada ***
  Completed: cuando la orden de producción tenga estatus PUBLISHED.

  requisiciones: RR (amarillo), AA (verde), P* (azul claro), CC (azul oscuro), DD (rosa), CA (gris)
  órdenes: TD (amarillo), IP (naranja), DD (verde), PP (negro)
*/

const RE_NOSORT =
  /^(?:form_field_options|cicle|grades|task_.*|(card|order|req)_statuses|assignments|language)$/

const HARDCODED_LANGUAGE = [
  { id: 'ES', name: 'Spanish', knotion_id: 1 },
  { id: 'EN', name: 'English', knotion_id: 2 },
]

const strIds = {
  assignments: true,
  order_statuses: true,
  req_statuses: true,
  task_instance_statuses: true,
  task_delivery_statuses: true,
  evaluation_type: true,
  language: true,
  users: true,
}

const _cat = {}

/**
 * Establece los catálogos "hardcodeados" de la app que, aunque deben mantenerse
 * sincronizados con la API, se espera que sus valores no cambien.
 *
 * @param   {Object} cats Catálogos ya procesados
 * @returns {Object} Los catálogos extendidos con los hardcodeados.
 */
function setHardcodedCats(cats) {
  cats.evaluation_type = [
    { id: 'S', name: 'Escalar' },
    { id: 'B', name: 'Binario' },
  ]
  cats.validations = [
    'Ninguna',
    'Validación Académica',
    'Validación de Arte',
    'Validación de QA',
    'Validación Técnica',
  ]
  return cats
}

function _get(cat) {
  if (!_cat.hasOwnProperty(cat)) {
    throw new Error(`Catálogo "${cat}" no encontrado.`)
  }
  return _cat[cat]
}

function _itemFromName(cat, name) {
  name = name.toLowerCase()
  return cat.find(o => o.name.toLowerCase() === name)
}

function getNames(cat) {
  return _get(cat).map(o => o.name)
}

function getIds(cat) {
  return _get(cat).map(o => o.id)
}

function idFromName(cat, name) {
  if (name == null) {
    throw new Error('idFromName: Se requiere "name".')
  }
  const item = _itemFromName(_get(cat), name)

  return item ? item.id : strIds[cat] ? '' : 0
}

function nameFromId(cat, id) {
  if (id == null) {
    throw new Error('nameFromId: Se requiere un ID')
  }
  if (!strIds[cat]) id |= 0
  const item = _get(cat).find(o => o.id === id)

  return item ? item.name : ''
}

function elemFromName(cat, name) {
  if (name == null) {
    throw new Error('idFromName: Se requiere "name".')
  }
  return _itemFromName(_get(cat), name)
}

function elemFromId(cat, id) {
  if (id == null) {
    if (['resource_types', 'resource_versions', 'resource_type_groups'].includes(cat)) {
      return null
    }
    throw new Error('nameFromId: Se requiere un ID')
  }
  if (!strIds[cat]) id |= 0

  return _get(cat).find(o => o.id === id)
}

function userByUname(uname) {
  if (!uname) return null
  uname = uname.toLowerCase()
  return _cat.users.find(u => u.uname === uname) || null
}

function reqStatusEditable(status) {
  const item = _cat.req_statuses.find(st => st.id === status)
  return item && item.editable
}

// ===========================================================================

/**
 * El chorizote de preparación de los catálogos.
 * Esto es el preprocesamiento que ordena, completa campos, etc,
 *
 * Este llama al endpoint y preprocesa el response ordenando elementos,
 * completando propiedades, etc.
 *
 * Si hay error usa los catálogos guardados, si existen y son correctos.
 *
 * @returns {Object} Cada llave es el nombre del catálogo.
 */
function init() {
  const key = '_catalogs'

  function queueMessage(msg, fail) {
    if (fail || !_cat.resource_types) {
      App.error(msg)
      if (navigator.onLine) {
        App.ui.alert(msg + '<br>La aplicación fallará.', () => {
          window.location.href = 'error.html'
        })
      } else {
        window.location.href = 'error.html'
      }
    } else {
      App.ui.toast.error(msg)
      App.log(`${msg}<br>La aplicación está usando los catálogos respaldados.`)
    }
  }

  const getValid = function (o) {
    const isArray = Array.isArray

    o =
      o &&
      isArray(o.card_statuses) &&
      'set_final_resource' in o.card_statuses[0] && // nuevo formato
      isArray(o.country) &&
      isArray(o.order_statuses) &&
      isArray(o.req_statuses) &&
      isArray(o.resource_type_groups) &&
      isArray(o.resource_types) &&
      isArray(o.resource_versions) &&
      isArray(o.users) &&
      o.cicle &&
      typeof o.cicle == 'object' &&
      o.form_field_options &&
      o.form_field_options.requisitions &&
      o

    // Prepara acceso directo al ID de los status "DD" y "PP"
    if (o) {
      const cs = o.card_statuses
      const CS = {
        READY: (cs.find(c => c.status === $_ORDER_ST.READY) || {}).id,
        PUBLISHED: (cs.find(c => c.status === $_ORDER_ST.PUBLISHED) || {}).id,
      }
      if (CS.READY && CS.PUBLISHED) {
        App.CS = CS // todo bien
      } else {
        o = null // error, card_statuses no está actualizado
      }
    }

    return o
  }

  function prepare(res) {
    const sortS = (a, b) => a.localeCompare(b)
    const sortA = (a, b) => {
      const key = a.hasOwnProperty('name') ? 'name' : a.hasOwnProperty('title') ? 'title' : null

      return key ? a[key].localeCompare(b[key]) : 1
    }
    const sortT = (a, b) => a.resource_type_group_id - b.resource_type_group_id
    const sortV = (a, b) => a.resource_type_name.localeCompare(b.resource_type_name)

    delete res.task_statuses

    res.resource_types.forEach(t => {
      t.name = t.type
    })

    const types = {}
    res.resource_versions.forEach(v => {
      const name = types[v.resource_type_id]
      if (name) {
        v.resource_type_name = name
      } else {
        const type = res.resource_types.find(t => t.id === v.resource_type_id)
        v.resource_type_name = types[v.resource_type_id] = type ? type.name : '?'
      }
    })

    // Permite usar el nombre de campo correcto para 'requisition_type_str'
    res.form_field_options.requisitions.requisition_type_str = res.requisition_types.map(
      r => ({ value: r.name, name: r.name })
    )

    // Establece el flag 'editable' y los colores de status de requisiciones
    const reEdit = App.config.ED_REQ_STATUS
    res.req_statuses.forEach(o => {
      o.editable = reEdit.test(o.id)
      o.color = 'req-' + o.id
    })

    // Establece los colores de status de órdenes
    res.order_statuses.forEach(o => {
      o.color = 'op-' + o.id
    })

    res.grades = res.grades
      .sort((a, b) => a.id - b.id)
      .map(o => ({
        id: o.initials,
        name: o.name,
        name_es: o.name_es,
        country_id: o.country_id,
        key: `G${o.id}`,
      }))

    res.users.forEach(u => {
      const names = []
      if (u.firstName) names.push(u.firstName)
      if (u.secondName) names.push(u.secondName)
      if (u.firstSurname) names.push(u.firstSurname)
      u.id = u.idUser
      u.name = names.join(' ') || u.userName
      u.uname = u.userName.toLowerCase() // acelera las búsquedas
      if (u.picture.endsWith('/user_x_icn.png')) u.picture = null // ignora avatar genérico
    })

    // Corrije los ciclos que llegan en un objeto
    res.cicle = Object.keys(res.cicle).map(c => res.cicle[c])

    // Reordena los catálogos que lo necesiten y bloquea su posterior edición
    Object.keys(res).forEach(k => {
      const o = res[k]
      if (Array.isArray(o) && !RE_NOSORT.test(k)) {
        o.sort(typeof o[0] == 'string' ? sortS : sortA)
      }
      if (k === 'resource_types') {
        o.sort(sortT)
      } else if (k === 'resource_versions') {
        o.sort(sortV) // ordenación especial por el nombre del tipo
      }
      Object.freeze(o)
    })

    // Elimina las llaves existentes en `_cat` (pues es const)
    Object.keys(_cat).forEach(k => {
      delete _cat[k]
    })

    _cat.language = HARDCODED_LANGUAGE

    // Asigna los catálogos recibidos preprocesados, los hardcodeados, y vuelve
    return setHardcodedCats(assign(_cat, res))
  }

  // Primero asigna a _cat los catálogos de localStorage, si existen
  // y son válidos estarán relativamente actualizados...
  assign(_cat, getValid(App.config.ls(key)))

  // ...ahora llama al endpoint para obtener los datos "frescos", esta
  // llamada se va a un Deferred (promise).
  const promise = App.server('/catalogs')
    .done(res => {
      if (getValid(res)) {
        res = prepare(res)
        App.config.ls(key, res, true)
      } else {
        queueMessage('Error en el formato de los catálogos.', 1)
      }
    })
    .fail(xhr => {
      const status = ~~(xhr && xhr.status)
      if (status === 401) {
        App.user.logout(true) // `true` forza salida inmediata!!!
        window.location.reload(true)
      } else {
        queueMessage(`Error ${status} leyendo los catálogos de la aplicación.`)
      }
    })

  // Se elimina la precarga de catálogos, el deferred siempre se resolverá
  // con los datos actualizados.
  return promise
} // init() END

module.exports = {
  get: _get,
  getNames,
  getIds,
  idFromName,
  nameFromId,
  elemFromName,
  elemFromId,
  userByUname,
  reqStatusEditable,
  init,
}
