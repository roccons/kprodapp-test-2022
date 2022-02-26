/*
  Table initialization
*/
'use strict'

$.extend(true, $.fn.bootstrapTable.defaults, {
  locale: 'es-MX',
  sortOrder: 'desc',
  striped: true,
  dataField: 'data',
  queryParams: queryParams,
  queryParamsType: 'page',
  showRefresh: true,
  silentRefresh: true,
  trimOnSearch: false,
  searchOnEnterKey: true,
  onLoadError: onLoadError,
  iconSize: 'outline',
  iconsPrefix: '',
  icons: {
    paginationSwitchDown: 'wb-chevron-down',
    paginationSwitchUp: 'wb-chevron-up',
    columns: 'wb-list-bulleted',
    toggle:  'fa-list-alt',
    refresh: 'wb-loop',
    detailOpen: 'wb-plus',
    detailClose: 'wb-minus'
  }
})

// Transform the request parameters
function queryParams(qp) {
  if (typeof qp.searchText === 'string') {
    // eslint-disable-next-line
    qp.searchText = qp.searchText.replace(/(^\w+:|^)\/\//, '');
  }

  return {
    page: qp.pageNumber,
    per_page: qp.pageSize,
    sort_name: qp.sortName,
    sort_order: qp.sortOrder,
    search_text: qp.searchText,
    tzo: App.tzo
  }
}

let err401 = 0

// Simple "handler" for ajax errors
function onLoadError(status, xhr) {
  if (status === 401) {
    if (!err401) {
      ++err401
      App.ui.alert('La sesión expiró, debe ingresar de nuevo.', () => {
        App.user.logout(true)
      })
    }
  } else {
    App.ui.toast.error(`Error leyendo datos desde el servidor: ${App.server.errStr(xhr)}`)
  }
}

// Defaults exclusivos para éste módulo
const defaults = {
  classes: 'table table-hover table-no-bordered',
  pagination: true,
  search: true,
  showColumns: true,          // keep here in this "defaults" object
  showToggle: true,           // keep here in this "defaults" object
  onCheck: onCheckCheck,
  onUncheck: onCheckCheck,
  onCheckAll: onCheckCheck,
  onPageChange: onPageChange,
  onSearch: onSearch,
  onSort: onSort,
  onToggle: onToggle,
  onUncheckAll: disableButtons,
  mobileResponsive: true
}

//=============================================================================
// ACTION BUTTONS
//-----------------------------------------------------------------------------

// Set the state of the action buttons (in the toolbar)
function setButtonsDisabled(toolbar, disable) {
  if (toolbar) {
    $(toolbar).find('.needs-one').prop('disabled', disable).toggleClass('disabled', disable)
  }
}

function disableButtons() {
  setButtonsDisabled(this.toolbar, true)
}

function onCheckCheck() {
  const sels = $(this.tableId).bootstrapTable('getAllSelections')
  setButtonsDisabled(this.toolbar, !sels.length)
}

// Actualiza los botones del toolbar después de una llamada a endpoint.
function onLoadSuccess() {
  const check = this.selectItemName
  const disabled = !this.data.find(d => d[check])
  setButtonsDisabled(this.toolbar, disabled)
}

//=============================================================================
// ACTIONS SAVING ITS STATE
//-----------------------------------------------------------------------------

// save the user selected page size
function onPageChange(number, size) {
  const prefix = this.tablePrefix

  App.config.rt(prefix + ':pageNumber', number)
  App.config.ls(prefix + ':pageSize', size)
}

function onSearch(text) {
  if (typeof text === 'string') {
    // eslint-disable-next-line
    text = text.replace(/(^\w+:|^)\/\//, '');
  }

  App.config.rt(this.tablePrefix + ':search', text)
}

function onSort(name, order) {
  const prefix = this.tablePrefix

  App.config.rt(prefix + ':sortName',  name)
  App.config.rt(prefix + ':sortOrder', order)
}

// save the user selection for cardview
function onToggle(cv) {
  App.config.ls(this.tablePrefix + ':cardView', cv)
  $.hideTooltips()
}

// save the user selected visible columns
function onColumnSwitch() {
  const cols = []

  $(this.tableId).find('th[data-field]').each(function () {
    cols.push(this.getAttribute('data-field'))
  })
  App.config.ls(this.tablePrefix + ':cols', cols)
}

// Handler for context changes of the slidePanel.
//
App.on('slide-view-change', function viewerChange(ctx) {
  const $table = $('#main-page').find('.fixed-table-body table')

  $table.find('tr.view-active').removeClass('view-active')
  if (ctx) {
    $table.each(function () {
      const bst  = $(this).data('bootstrap.table')
      const fld  = bst && bst.options && bst.options.uniqueId
      if (fld && fld in ctx) {
        $(this).find(`tr[data-uniqueid="${ctx[fld]}"]`).addClass('view-active')
      }
    })
  }
})

// Restores the visible state of the columns and page size setting
//
function restoreUserPref(prefix, conf) {
  const ls = App.config.ls
  const rt = App.config.rt

  const size = ls.get(prefix + ':pageSize') | 0
  if (size > 0) conf.pageSize = size

  const page = rt.get(prefix + ':pageNumber') | 0
  if (page > 1) conf.pageNumber = page

  const cols = ls.get(prefix + ':cols')
  if (cols) {
    conf.columns.forEach(col => {
      if (cols.includes(col.field)) col.visible = true
    })
  }

  const name = rt.get(prefix + ':sortName')
  if (name) {
    const ok = conf.columns.find((c) => c.field === name)
    if (ok) {
      conf.sortName  = name
      conf.sortOrder = rt.get(prefix + ':sortOrder') === 'desc' ? 'desc' : 'asc'
    }
  }

  if (conf.showToggle) {
    const view = ls.get(prefix + ':cardView')
    conf.cardView = view === true
    conf.mobileResponsive = false
  }

  const text = rt.get(prefix + ':search')
  if (text) {
    conf.searchText = text
  }
}

//============================================================================
// MAIN: Instantiate the customized bootstrap-table
//----------------------------------------------------------------------------

function tableInit(prefix, root, conf, withoutRestoreUserPref = false) {

  const tableId = `#${prefix}Table`
  const qparams = conf.queryParams

  // Since we change the options, first we need to duplicate (deep)
  conf = $.extend(true, {
    tablePrefix: prefix,
    tableId,
    onColumnSwitch,
    sidePagination: conf.url ? 'server' : 'client'
  }, defaults, conf)

  if (qparams) {
    conf.queryParams = qp => qparams(queryParams(qp))
  }

  // grab the non-switchable columns
  let count = 0
  if (conf.showColumns) {
    conf.columns.forEach(col => {
      if (col.switchable === false) {
        col.visible = true
        count++
      } else if (col.checkbox) {
        col.width = 38
        col.visible = true
      } else {
        col.visible = col.visible === true
        if (col.visible) ++count
      }
    })
  }
  if (!count) conf.columns.forEach(col => { col.visible = true })

  if (!conf.idField) {
    conf.idField = conf.uniqueId
  }

  if (conf.url) {
    conf.url = App.server.fullUrl(conf.url)
  }

  if (conf.condensed) {
    conf.classes += ' table-condensed'
  }

  if (!withoutRestoreUserPref) {
    restoreUserPref(prefix, conf)
  }

  const $table = $(tableId).bootstrapTable(conf)

  const bst = $table.data('bootstrap.table')

  // keep tooltip container out of the buttons
  bst.$toolbar.find('[title]').tooltip({ container: '#main-page', delay: 200 })

  if (bst.options.maintainSelected) {
    bst.options.onLoadSuccess = onLoadSuccess
  }

}

module.exports = tableInit
