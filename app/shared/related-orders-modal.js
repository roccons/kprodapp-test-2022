const dateFormatter  = require('scripts/lib/dates').dateTimeFormat
const elemFromId  = App.catalogs.elemFromId

const BT_PREFIX   = 'action-relate'
const DIALOG_ID   = `#${BT_PREFIX}-dialog`

const BTN_CANCEL = DIALOG_ID + '-cancel'
const BTN_SAVE = DIALOG_ID + '-save'

const relatedOrdersAssociated = []
const originalRelatedOrdersAssociated = []

const statusFormatter = (status) => {
  status = status && elemFromId('order_statuses', status)

  if (!status) return '-'

  return `<span class="boxed-status ${status.color}">${status.name}</span>`
}

const linkFormmater = (id) => {
  return `<a href="#/orden/${id}" target="_blank">
    <span class="fa-external-link"></span>
  </a>`
}

const relatedFormmater = (isRelated) => {
  return `<span class="fa-link related-icon ${isRelated ? 'is-related' : ''}"></span>`
}

const translationFormatter = (isTranslation) => {
  return `<span> ${isTranslation ? 'Si' : 'No'}</span>`
}

const columns = [
  {
    field: 'is_related_order',
    title: '',
    titleTooltip: 'Relacionar orden',
    sortable: true,
    formatter: relatedFormmater
  },
  {
    field: 'id',
    title: 'ID',
    titleTooltip: 'Id de la orden de producción',
    class: 'no-break text-center',
    sortable: true,
    order: 'desc'
  },
  {
    field: 'resource_title',
    title: 'Título del recurso',
    sortable: true,
    order: 'desc',
    class: 'min-width-medium'
  },
  {
    field: 'created_at',
    title: 'Fecha de creación',
    sortable: false,
    order: 'asc',
    formatter: dateFormatter
  },
  {
    field: 'status',
    title: 'Estatus',
    class: 'no-break',
    sortable: true,
    order: 'desc',
    formatter: statusFormatter
  },
  {
    field: 'grade',
    title: 'Grado',
    sortable: true,
    order: 'desc',
  },
  {
    field: 'challenge',
    title: 'Reto',
    sortable: true,
    order: 'desc',
  },
  {
    field: 'resource_type',
    title: 'Tipo del recurso',
    sortable: true,
    order: 'desc'
  },
  {
    field: 'is_translation',
    title: 'Traducción',
    sortable: true,
    order: 'desc',
    formatter: translationFormatter
  },
  {
    field: 'id',
    title: '',
    titleTooltip: 'Enlace externo',
    class: 'has-link',
    sortable: false,
    formatter: linkFormmater
  }
]

const arrayEquals = (arr1, arr2) => {
  return Array.isArray(arr1) &&
      Array.isArray(arr2) &&
      arr1.length === arr2.length &&
      arr1.every((value) => arr2.includes(value))
}

const updateSaveForm = () => {
  if (!arrayEquals(relatedOrdersAssociated, originalRelatedOrdersAssociated)) {
    $(BTN_SAVE).attr('disabled', false)

    return
  }

  $(BTN_SAVE).attr('disabled', true)
}

const onClickRow = (order, row) => {
  if (row && row.context && hasClass(row.context, 'has-link')) {
    return
  }

  const index = relatedOrdersAssociated.indexOf(order.id)
  const $relatedIcon = $(row).find('.related-icon')

  if (index > -1) {
    relatedOrdersAssociated.splice(index, 1)
    $relatedIcon.removeClass('is-related')
  } else {
    relatedOrdersAssociated.push(order.id)
    $relatedIcon.addClass('is-related')
  }

  updateSaveForm()
}

const responseHandler = (res) => {
  const relatedOrder = res.data.filter(order => order.is_related_order)
    .map(order => order.id)

  relatedOrdersAssociated.push(...relatedOrder)
  originalRelatedOrdersAssociated.push(...relatedOrder)

  return res
}

const queryParams = (qp, data, requisitionOrOrder) => {
  $(DIALOG_ID).find('.modal-title').text('Órdenes de producción relacionadas')

  if (requisitionOrOrder === 'requisition') {
    qp.requisition_id = data.id
  } else {
    qp.order_id = data.id
  }

  return qp
}

const close = () => $(DIALOG_ID).modal('hide')

const save = (ctx) => {
  const resourceEndpoint = ctx.requisitionOrOrder === 'requisition' ? 'requisitions' : 'orders'
  const url = `/${resourceEndpoint}/${ctx.id}/relatedOrders`
  const data = {
    related_orders: relatedOrdersAssociated
  }

  App.server(url, 'POST', { data })
    .done(data => {
      if (ctx.callback && typeof ctx.callback === 'function') {
        ctx.callback(ctx.id, data)
      }

      close()

      App.ui.toast.success('Se guardaron las órdenes relacionadas')
    })
    .fail(err => {
      console.err(err)

      App.ui.toast.error('No se pudieron guardar las órdenes relacioandas')
    })
}

const onBtnSaveClick = function ({ data }) {
  if ($(this).attr('disabled')) return

  save(data)

  $(this).attr('disabled', true)
}

module.exports = function relateOrders(event, data, requisitionOrOrder = 'requisition', callback) {
  event.preventDefault()

  const userCantEditRelatedOrders = requisitionOrOrder === 'requisition'
    ? data.user_capabilities.hasOwnProperty('edit-requisition-related-order')
    : data.user_capabilities.hasOwnProperty('edit-order-related-order')

  const ctx  = assign({
    prefix: BT_PREFIX,
    title: 'Agregar a orden de producción existente',
    requisitionOrOrder,
    callback
  }, data)

  const view = require('./related-orders-modal.pug')
  const init = require('scripts/table-init')

  const onShowForm = function () {
    const $box = $(this)

    $box.find('button.close').focus()

    setImmediate(() => {
      $box.find('.search input').attr('placeholder', 'Buscar orden de producción existente').focus()
      $box.find(BTN_CANCEL).click(ctx, close)

      if (userCantEditRelatedOrders) {
        $box.find(BTN_SAVE).click(ctx, onBtnSaveClick)
      } else {
        $box.find(BTN_SAVE).attr('disabled', true)
      }
    })
  }

  $(DIALOG_ID).remove()

  $(view(ctx)).appendTo('#main-page')
    .modal()
    .on('shown.bs.modal', onShowForm)
    .on('hidden.bs.modal', function () {
      relatedOrdersAssociated.splice(0, relatedOrdersAssociated.length)
      originalRelatedOrdersAssociated.splice(0, originalRelatedOrdersAssociated.length)

      $(this).remove()
    })

  init(BT_PREFIX, '', {
    url: '/related-orders',
    columns,
    uniqueId: 'id',
    requisId: ctx.id,
    toolbar: '',
    condensed: true,
    showColumns: false,
    showRefresh: false,
    showToggle: false,
    searchAlign: 'left',
    queryParams: qp => queryParams(qp, ctx, requisitionOrOrder),
    onClickRow: userCantEditRelatedOrders ? onClickRow : () => false,
    responseHandler
  }, true)
}
