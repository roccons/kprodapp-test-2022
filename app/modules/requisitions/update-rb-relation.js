const getResource = require('scripts/get-resource')

function updateView(ctx) {
  const check = require('scripts/form-access')
  const tmpl = require('./views/detail-relation-rb.pug')
  const $actions = $('#rb-relations').empty().html(tmpl(ctx))
  check($actions.get(0), ctx)
}

module.exports = function updateRelationRBView(ctx, noServer, callback) {
  if (noServer) {
    updateView(ctx)

    if (typeof callback === 'function') callback(ctx)

    return
  }

  if (ctx.reference_resource_id === ctx.krb_resource_id) {
    const resId = ctx.krb_resource_id ? ctx.krb_resource_id : ctx.reference_resource_id
    if (resId) {
      getResource(resId)
        .done(({ data }) => {
          if (data[0]) {
            const resref = data[0]

            ctx.reference_resource_title = resref.title
            ctx.reference_resource_type = resref.resourceType
            ctx.reference_file_origin = resref.fileOrigin
            ctx.krb_resource_title = resref.title
            ctx.krb_resource_type = resref.resourceType
            ctx.krb_resource_file_origin = resref.fileOrigin

            updateView(ctx)

            if (typeof callback === 'function') callback(ctx)

            return
          }

          App.ui.toast.error('No fue posible obtener la información de Resource Bank')
        }).fail(() => { App.ui.toast.error('No fue posible obtener la información de Resource Bank') })
    }
  } else {
    if (ctx.reference_resource_id) {
      getResource(ctx.reference_resource_id)
        .done(({ data }) => {
          if (data[0]) {
            const resref = data[0]

            ctx.reference_resource_title = resref.title
            ctx.reference_resource_type = resref.resourceType
            ctx.reference_file_origin = resref.fileOrigin

            updateView(ctx)
            if (typeof callback === 'function') callback(ctx)

            return
          }

          App.ui.toast.error('No fue posible obtener la información de Resource Bank')
        }).fail(() => { App.ui.toast.error('No fue posible obtener la información de Resource Bank') })
    }

    if (ctx.krb_resource_id) {
      getResource(ctx.krb_resource_id)
        .done(({ data }) => {
          if (data[0]) {
            const reskrb = data[0]
            ctx.krb_resource_title = reskrb.title
            ctx.krb_resource_type = reskrb.resourceType
            ctx.krb_resource_file_origin = reskrb.fileOrigin

            updateView(ctx)

            if (typeof callback === 'function') callback(ctx)

            return
          }

          App.ui.toast.error('No fue posible obtener la información de Resource Bank')
        }).fail(() => App.ui.toast.error('No fue posible obtener la información de Resource Bank'))
    }
  }
}
