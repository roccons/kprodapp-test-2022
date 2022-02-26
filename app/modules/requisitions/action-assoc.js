const preprocData = require('modules/orders/utils/preproc-table-data')
const dateFormat  = require('scripts/lib/dates').dateTimeFormat
const elemFromId  = App.catalogs.elemFromId

const BT_PREFIX   = 'action-assoc'
const DIALOG_ID   = `#${BT_PREFIX}-dialog`

const EVT = require('./evt_ids')

function getStore() {
  return App.store.get(EVT.STORE)
}

const columns = [
  {
    field: 'id',
    title: 'ID',
    titleTooltip: 'Id de la orden de producción',
    class: 'no-break text-center',
    sortable: true,
    order: 'desc'
  }, {
    field: 'resource_title',
    title: 'Título del recurso',
    sortable: true,
    order: 'desc',
    class: 'min-width-medium'
  }, {
    field: 'created_at',
    title: 'Fecha de creación',
    sortable: false,
    order: 'asc',
    formatter: dateFormat
  }, {
    field: 'status',
    title: 'Estatus',
    class: 'no-break',
    sortable: true,
    order: 'desc',
    formatter: statusFmt
  }, {
    field: 'grade',
    title: 'Grado',
    sortable: true,
    order: 'desc',
  }, {
    field: 'challenge',
    title: 'Reto',
    sortable: true,
    order: 'desc',
  }, {
    field: 'resource_type',
    title: 'Tipo del recurso',
    sortable: true,
    order: 'desc'
  }, {
    field: 'id',
    title: '',
    titleTooltip: 'Enlace externo',
    class: 'has-link',
    sortable: false,
    formatter: linkFmt
  }
]

function responseHandler(res) {
  if (res.data && res.data.length) {
    res.data.forEach(preprocData)
  }
  return res
}

function linkFmt(id) {
  return `<a href="#/orden/${id}" class="fa-external-link" target="_blank"></a>`
}

function statusFmt(s) {
  s = s && elemFromId('order_statuses', s)
  if (!s) return '-'
  return `<span class="boxed-status ${s.color}">${s.name}</span>`
}

function onShowForm() {
  const $box = $(this)
  $box.find('button.close').focus() // a veces este botón queda oculto en la Mac
  setImmediate(() => {
    $box.find('.search input').attr('placeholder', 'Buscar orden de producción existente').focus()
  })
}

/**
 * Confirma el cambio de requisición preguntando si se deben conservar
 * o sobreescribir los datos con los de la nueva requisición.
 * El usuario puede elegir "Cancelar", si continúa, se ejecuta el callback
 * que envía el valor `master_requisition_syncdata` correcto al endpoint.
 *
 * @param {object} order -
 * @param {HTMLElement} tr -
 */
function onClickRow(order, tr) {
  if (tr && tr.context && hasClass(tr.context, 'has-link')) {
    return
  }
  const $dialog  = $(DIALOG_ID)
  const requisId = this.requisId
  const orderId  = order.id
  const urlFormatter = App.pusher.urlFormatter
  const ctx = getStore()

  // Función y botones para el popup que pregunta si conservar datos
  const cb = function (resp) {
    if (resp !== App.ui.YES && resp !== App.ui.NO) {
      this.close()
      return true
    }
    const data = {
      master_requisition_syncdata: resp === App.ui.YES,
    }
    $dialog.find('.submit-form').prop('disabled', true)
    this.setMessage('Asociando...')
    this.setButtons(App.ui.CLOSE)

    App.server(`/requisitions/${requisId}/associateToOrder/${orderId}`, 'POST', { data })
      .done(res => {
        const view = require('./views/detail-info-ids.pug')
        ctx.order_id = res.order_id
        ctx.krb_resource_id = res.krb_resource_id
        if (res.resource_id) ctx.resource_id = res.resource_id
        if (res.status) ctx.status = res.status
        //Se genera la url hacia boards
        ctx.board_url = urlFormatter({
          model_type: 'order',
          grade: ctx.grade,
          challenge: ctx.challenge,
          model_id: ctx.order_id
        })
        this.close()
        $dialog.modal('hide')
        $('#detail-form').find('.info-ids').html(view(ctx))
        ctx.trigger(EVT.STATUS_UPDATED)
        App.ui.toast.success(`La requisición se asoció con éxito a la orden.<br><a href="#/orden/${
          orderId}">Ir a la orden de producción.</a>`)
      })
      .fail(xhr => {
        $dialog.find('.submit-form').prop('disabled', false)
        this.close()
        App.ui.toast.error(`Error asociando la requisición ${App.server.errStr(xhr)}`)
      })

    return false  // do not close the confirm
  }
  const buttons = [
    { id: App.ui.CANCEL, caption: 'Cancelar' },
    { id: App.ui.NO,     caption: 'Conservar datos' },
    { id: App.ui.YES,    caption: 'Sobreescribir datos', default: true },
  ]
  const message = `Se asociará la requisición "${ctx.resource_title}" con la orden "${order.resource_title}".<br>
  ¿Desea sobreescribir los datos de la orden con los de esta requisición?`

  App.ui.dialog(message, { extra: true }, cb, cb, buttons)
}

function queryParams(qp, data) {
  $(DIALOG_ID).find('.modal-title').text(
    qp.search_text || !data.reference_resource_id && !data.krb_resource_id
    ? 'Agregar a orden de producción existente'
    : 'Mostrando órdenes con el mismo ID de resource bank / ID de referencia'
  )

  if (!qp.search_text) {

    // en indice 0 corresponde a krb_resource_id
    // el indice 1 corresponde a reference_resource_id
    const orderAssociation = [
      data.krb_resource_id,
      // process_type: null|new  4 = null
      [null, 3, 4].includes(data.process_type) ? data.reference_resource_id : null
    ]

    qp.filters = JSON.stringify({ order_association: orderAssociation })
  }
  return qp
}

//function rowStyle(row) {
//  return row.order_id ? { classes: 'unselectable' } : {}
//}

module.exports = function actionAssociate(jqev) {
  const ctx  = assign({
    prefix: BT_PREFIX,
    title: 'Agregar a orden de producción existente'
  }, jqev.data)
  const view = require('./views/action-dialog.pug')
  const init = require('scripts/table-init')

  $(DIALOG_ID).remove()

  if (!ctx.user_capabilities['order-associate']) {
    App.ui.alert('No tienes permitido asociar esta requisición a una orden.')
    return
  }

  $(view(ctx)).appendTo('#main-page')
    .modal()
    .on('shown.bs.modal', onShowForm)
    .on('hidden.bs.modal', $.selfRemove)

  init(BT_PREFIX, '', {
    url: '/orders',
    columns,
    uniqueId: 'id',
    requisId: ctx.id,
    toolbar: '',
    condensed: true,
    showColumns: false,
    showRefresh: false,
    showToggle: false,
    searchAlign: 'left',
    queryParams: qp => queryParams(qp, ctx),
    onClickRow,
    responseHandler
  })

}
