module.exports = function actionDelete(jqev) {
  const ctx = jqev.data

  App.ui.confirm('¿Estás seguro que deseas eliminar esta requisición?',
    function () {

      const closeForm = () => { App.goToPage('requisiciones') }

      this.setMessage('Eliminando...')
      this.setButtons(App.ui.CLOSE)

      App.server(`/requisitions/${ctx.id}`, 'DELETE')
        .complete(
          (xhr) => {
            if (xhr.status === 200) {
              App.ui.toast.success('La requisición ha sido eliminada.')
              this.close(closeForm)
            } else {
              this.setMessage(`Error eliminando la requisición ${App.server.errStr(xhr)}`)
            }
          }
        )

      return false
    })
}
