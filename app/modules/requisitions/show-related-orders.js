const urlFormater = App.pusher.urlFormatter

const relatedOrderTemplate = order => {
  const url = urlFormater({
    model_type: 'order',
    grade: order.grade,
    challenge: order.challenge,
    model_id: order.id,
  })

  return `
    <a href="${url}" target="_blank" title="${order.resource_title}">
      ${order.id}
    </a>
  `
}

const renderRelatedOrders = relatedOrders => {
  const $container = $('#requisition-related-orders')

  if (relatedOrders.length < 1) {
    return
  }

  $container.empty()

  relatedOrders.forEach((order, index) => {
    $container.append(relatedOrderTemplate(order))

    if (index < relatedOrders.length - 1) {
      $container.append('<span style="margin-right: 4px">,</span>')
    }
  })
}

const getRelatedOrders = requisitionId => {
  const data = {
    requisition_id: requisitionId,
    show_suggested: 0,
    per_page: -1,
    order_name: 'id'
  }

  App.server('/related-orders', 'GET', { data })
    .done(({ data }) => renderRelatedOrders(data))
    .fail(err => {
      console.log(err)
      App.ui.toast.error(
        'No fue posible obtener la información de las ordenes relacionadas'
      )
    })
}

module.exports = function (requisitionId, relatedOrders = null) {
  if (!requisitionId) {
    return
  }

  if (relatedOrders) {
    renderRelatedOrders(relatedOrders)

    return
  }

  getRelatedOrders(requisitionId)
}
