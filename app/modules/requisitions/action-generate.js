/**
 * Handler jQuery del botón "Generar orden de producción"
 *
 * @param {object} jqev - Evento jQuery, .data es el contexto pasado como parámetro
 */
module.exports = function actionGenerate(jqev) {
  const ctx = jqev.data || {}

  if (!ctx.user_capabilities['order-generate']) {
    App.ui.alert('No tienes permitido generar una orden con esta requisición.')
    return
  }

  App.ui.yesNo('¿Deseas crear una nueva orden a partir de esta requisición?',
    function createOrder() {

      this.setMessage('Generando orden...')
      this.setButtons(App.ui.CLOSE)   // no usar "OK" pues se cae en recursión

      const data = { master_requisition_id: ctx.id }

      App.server('/orders', 'POST', { data })
        .then(
          (res) => {
            this.close(() => { App.goToPage(`orden/${res.id}`) })
            App.ui.toast.success('La orden se generó exitosamente.')
          },
          (xhr) => {
            this.setMessage(`Error creando la orden: ${App.server.errStr(xhr)}`)
          }
        )

      return false  // evita cerrar diálogo
    })
}
