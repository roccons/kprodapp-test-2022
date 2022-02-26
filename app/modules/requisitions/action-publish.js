module.exports = function publish(jqev) {
  const ctx = jqev.data
  const view = require('./views/detail-info-ids.pug')
  const EVT = require('./evt_ids')
  const WAIT_MSG = '<div class="text-center">Publicando, espera por favor...<br>&nbsp;' +
  '<span class="spinner-lg active"></span></div>'

  App.ui.confirm('¿Estás seguro que deseas publicar esta requisición?',
    function () {

      this.setMessage('Publicando...')
      this.waitState(WAIT_MSG, null)

      App.server(`/requisitions/${ctx.id}/publish`, 'POST')
        .complete(
          (xhr) => {
            if (xhr.status === 201 || xhr.status === 200) {
              ctx.krb_resource_id = xhr.responseJSON.requisition.krb_resource_id
              $('#detail-form').find('.info-ids').html(view(ctx))
              ctx.status = xhr.responseJSON.requisition.status
              ctx.trigger(EVT.STATUS_UPDATED)
              App.ui.toast.success('Se ha publicado la requisición.')

              if (xhr.responseJSON.idResourceTranslationHaveBeenOverwritten) {
                App.ui.toast.info('Se sobreescribieron los ids de traducción.')
              }

              this.close(() => { App.goToPage(location.hash) })
            } else {
              this.setMessage(`${App.server.errStr(xhr)}`)
              this.setButtons(App.ui.CLOSE)
            }
          }
        )

      return false
    })
}
