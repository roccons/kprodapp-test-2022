module.exports = function deassign(jqev) {
  const ctx = jqev.data
  const view = require('./views/detail-info-ids.pug')
  const EVT = require('./evt_ids')
  const krbResType = ctx.krb_resource_type === 'Asset' ? 'asset' : 'recurso'

  const msg = '¿Estás seguro que deseas eliminar el ID de resource bank de la requisición?' +
              '<br><br> Asegúrate de borrar las asociaciones hechas a este recurso <br><br>' +
              `<a href="${App.config.KRB_URL_BASE + '/' + krbResType + '/' + ctx.krb_resource_id}" target="_blank">` +
              'Ver recurso en Resource Bank <span class="fa-external-link"></span></a>'

  App.ui.confirm(msg,
    function () {

      this.setMessage('Actualizando...')
      this.setButtons(App.ui.CLOSE)

      App.server(`/requisitions/${ctx.id}`, 'PATCH', { data: { krb_resource_id: null } })
        .complete(
          (xhr) => {
            if (xhr.status === 200) {
              const updateRb = require('./update-rb-relation')
              ctx.krb_resource_id = xhr.responseJSON.krb_resource_id
              $('#detail-form').find('.info-ids').html(view(ctx))
              ctx.trigger(EVT.STATUS_UPDATED)
              App.ui.toast.success('Se ha eliminado el ID de resource bank de la requisición.')
              this.close(() => { App.goToPage(location.hash) })
              updateRb(ctx, true)
            } else {
              this.setMessage(`Error eliminando el ID de resource bank de esta requisición ${App.server.errStr(xhr)}`)
            }
          }
        )

      return false
    })
}
