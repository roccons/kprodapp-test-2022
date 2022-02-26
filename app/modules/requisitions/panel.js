/*
  bootstrap-table "controller" for client-side pagination
*/
'use strict'

//const newResourceView = require('modules/orders/new')
const preprocData = require('./models/preproc-data')
const timeFormat  = require('scripts/lib/dates').dateTimeFormat
const elemFromId  = App.catalogs.elemFromId

const BT_PREFIX   = 'requis'
const STATUS_ID   = 'filter-status'
const processTypes = { 1: 'use', 2: 'edit', 3: 'new' }
const processTypeClasses = ['use', 'edit', 'new']

/*
  DB fields to table columns mapping (field, title, sortable, non-moveable)
 */
const columns = [
  {
    field: 'btSelectItem',
    checkbox: true,
    class: 'visor-exclude'
  }, {
    field: 'resource_id',
    title: 'ID autoría*',
    switchable: false,
    sortable: true,
    order: 'desc'
  }, {
    field: 'resource_original_id',
    title: 'ID original',
    switchable: true,
    sortable: true,
    order: 'desc'
  }, {
    field: 'id',
    title: 'ID requisición',
    class: 'no-break',
    sortable: true,
    order: 'desc'
  }, {
    field: 'order_id',
    title: 'ID orden',
    titleTooltip: 'ID de la orden asociada',
    sortable: true,
    order: 'desc'
  }, {
    field: 'krb_resource_id',
    title: 'ID resource bank',
    sortable: true,
    order: 'desc'
  }, {
    field: 'resource_title',
    title: 'Título del recurso*',
    switchable: false,
    sortable: true,
    order: 'desc',
    class: 'min-width-medium'
  },
  {
    field: 'process_type',
    title: 'Proceso',
    switchable: false,
    sortable: true,
    order: 'desc',
    class: 'min-width-medium',
    formatter: processType
  }, {
    field: 'grade',
    title: 'Grado',
    sortable: true,
    order: 'desc'
  }, {
    field: 'pathway',
    title: 'Pathway',
    sortable: true,
    order: 'desc'
  }, {
    field: 'language',
    title: 'Idioma',
    sortable: true,
    order: 'desc'
  }, {
    field: 'challenge',
    title: 'Reto',
    sortable: true,
    order: 'desc'
  }, {
    field: 'session',
    title: 'Sesión',
    sortable: true,
    order: 'desc'
  }, {
    field: 'classification',
    title: 'Clasificación*',
    switchable: false,
    sortable: true,
    order: 'desc'
  }, {
    field: 'status',
    title: 'Estatus*',
    class: 'no-break',
    switchable: false,
    sortable: true,
    order: 'desc',
    formatter: statusFmt
  }, {
    field: 'production_id',
    title: 'Producción',
    sortable: true,
    order: 'desc',
    formatter: productionFmt
  }, {
    field: 'resource_type_group',
    title: 'Categoría de recurso',
    sortable: true,
    order: 'desc'
  }, {
    field: 'resource_type',
    title: 'Tipo de recurso',
    visible: false,
    sortable: true,
    order: 'desc'
  }, {
    field: 'resource_version',
    title: 'Versión de recurso',
    sortable: true,
    order: 'desc'
  }, {
    field: 'needs_review',
    title: 'Aprobar',
    titleTooltip: 'Aprobar cambio de versión',
    class: '-needs-review',
    sortable: false,
    formatter: approveFmt
  }, {
    field: 'script',
    title: 'Script',
    sortable: true,
    order: 'desc',
    formatter: link
  }, {
    field: 'quicktags',
    title: 'QuickTags',
    visible: false
  }, {
    field: 'location_key',
    title: 'Clave de localización',
    class: 'no-break',
    visible: false,
    sortable: true,
    order: 'desc'
  }, {
    field: 'requested_by_str',
    title: 'Usuario solicitante',
    sortable: true,
    order: 'desc'
  }, {
    field: 'approved_by_str',
    title: 'Aprobado por',
    sortable: true,
    order: 'desc'
  }, {
    field: 'responsible_str',
    title: 'Productor responsable',
    sortable: true,
    order: 'desc'
  }, {
    field: 'reviewed_by_str',
    title: 'Revisor',
    sortable: true,
    order: 'desc'
  }, {
    field: 'assigned_editor_str',
    title: 'Editor asignado',
    sortable: true,
    order: 'desc'
  }, {
    field: 'created_at',
    title: 'Fecha de creación',
    visible: false,
    sortable: true,
    order: 'asc',
    formatter: timeFormat
  }, {
    field: 'updated_at',
    title: 'Fecha de modificación',
    visible: false,
    sortable: true,
    order: 'asc',
    formatter: timeFormat
  }
]

/*
 * Formatters and Sorters
 */

function processType(value) {
  return value
    ? `<span class='label label-${processTypeClasses[value - 1]}'>${processTypes[value]}</span>`
    : ''
}

function rowStyle(row) {
  return row.needs_review ? { classes: 'needs-review' } : {}
}

function statusFmt(s) {
  s = s && elemFromId('req_statuses', s)
  if (!s) return '-'
  return `<span class="boxed-status ${s.color}">${s.name}</span>`
}

function productionFmt(p) {
  p = p && elemFromId('production', p)
  if (!p) return '-'
  return p.name
}

function approveFmt(r, row) {
  if (!r) return null
  let title = 'Versión por aprobar\nAnterior: '
  const d = row.review_data
  if (d) {
    title += `${d.resource_type_group} \u2219 ${d.resource_type} \u2219 ${d.resource_version}`
  } else {
    title += '(sin información)'
  }
  return `<span class="-approve wb-check-circle" title="${title}"></span>`
}

function link(value) {
  if (value) {
    const text = value.length > 30 ? `${value.substr(0, 27)}...` : value
    return `<a href="${value}" target="_blank" title="${value}">${text}</a>`
  }
  return ''
}

/*
 * Table events
 */

// On click row opens the Resource Viewer
function onClickRow(ev) {
  let cell = ev.target

  if (cell.nodeName === 'A') {
    return
  }

  if (cell.nodeName !== 'TD') cell = $(cell).closest('TD')[0]

  if (cell && !hasClass(cell, 'visor-exclude')) {
    const _id = this.getAttribute('data-uniqueid')
    const ref = `#/requisicion/${_id}`

    ev.preventDefault()
    if (ev.ctrlKey || ev.metaKey) {
      require('scripts/open-in-tab')(ref)
    } else {
      App.goToPage(ref)
    }
  }
}

// Publicar y exportar órdenes
function doAction() {
  const $table = $(`#${BT_PREFIX}Table`)

  $.hideTooltips()
  this.blur()

  if (hasClass(this, '-quicktags')) {
    const rows = $table.bootstrapTable('getAllSelections')
    require('scripts/quicktags')(rows, 'requisitions')

  } else {
    const ids = $table.bootstrapTable('getAllSelections').map(o => o.id)

    if (hasClass(this, '-export')) {
      require('./panel-export')(ids)

    } else if (hasClass(this, '-generate')) {
      require('./panel-generate')(ids)

    } else if (hasClass(this, '-assignedit')) {
      require('./panel-editors')(ids)

    } else if (hasClass(this, '-approve')) {
      require('./panel-approve')(ids)

    } else if (hasClass(this, '-status')) {
      require('./panel-status')(ids)

    } else if (hasClass(this, '-unlink-idkrb')) {
      require('./panel-unlink-idkrb')(ids)
    }
  }
}


/*
 * Controller definition
 */
module.exports = function requisitionsPanel(el, ctx) {

  const AdvSearch = require('helpers/adv-search')
  const advSearch = new AdvSearch({
    prefix: BT_PREFIX,
    tmplFn: require('./views/adv-search.pug'),
  })
  const filter = require('./panel-filter')()

  const toolbar = `#${BT_PREFIX}Toolbar`
  const view  = require('./views/panel.pug')
  const initTable = require('scripts/table-init')

  // creates the dom now
  $(el).html(view(assign({ prefix: BT_PREFIX }, ctx)))
  getById(STATUS_ID)._filter = []

  // call this before table-init
  filter.showMarkup()

  const responseHandler = res => {
    const el = getById(STATUS_ID)
    // El DOM puede ya no existir al momento que nos llega el response
    if (!el) {
      return {
        data: [],
        total: 0,
      }
    }
    if (res.data) {
      res.data.forEach(preprocData)
    }
    const len = el._filter.shift()
    el.textContent = len ? 'Mostrando el resultado de los filtros aplicados.' : ''
    return res
  }

  const queryParams = qp => {
    const el = getById(STATUS_ID)
    const filters = assign(filter.filterData(), advSearch.getData())
    const len = Object.keys(filters).length

    el._filter.push(len)
    if (len) {
      qp.filters = JSON.stringify(filters)
    }
    if (len || el.textContent) {
      el.textContent = 'Aplicando filtros...'
    }
    return qp
  }

  initTable(BT_PREFIX, '#table-root', {
    url: '/requisitions',
    columns,
    uniqueId: 'id',
    toolbar,
    maintainSelected: true,
    rowStyle,
    responseHandler,
    queryParams,
  })

  // No podemos usar el onClickRow de la tabla, no informa si se presionó CTRL
  $(`#${BT_PREFIX}Table`).on('click', 'tr', onClickRow)

  $(toolbar).find('.-action').click(doAction)

  $('#adv-search-btn').click(advSearch.search)
  advSearch.showState()
}
