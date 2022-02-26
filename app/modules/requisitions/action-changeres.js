
const getResource = require('scripts/get-resource')
const EVT = require('./evt_ids.json')
const updateRB = require('./update-rb-relation')

let CTX = null
let form = null

function onShowForm() {
  form =  document.querySelector('#form-reference-resource')
  const $box = $(this)
  const inp = $box.find('#reference_resource_id')

  $('#btn-submit').click(saveForm)
  inp.focus().on('keypress', function (event) {
    if (event.keyCode === 13) {
      saveForm(event)
    }
  })
}

function saveForm(event) {
  event.preventDefault()
  $('#btn-submit').attr('disabled', true)

  getResource(form.reference_resource_id.value)
    .done(({ data }) => {
      if (data.length < 1) {
        App.ui.toast.error('El id de referencia no existe.')
      }

      data = data[0]

      const idResource = data.idResource_int
      CTX.reference_resource_id = idResource

      if (idResource) {
        if (CTX.fromCreateRequisition) {
          updateRB(CTX, false, CTX.enableSetKRBRelations)

          $('#reference-resource-dialog').modal('hide')
          CTX.trigger(EVT.STATUS_UPDATED)
          App.ui.toast.success('Id de Referencia actualizado correctamente')

          $('[name="reference_resource_id"]').val(idResource)

          return
        }

        App.server(`/requisitions/${CTX.id}`, 'PATCH', { data: { reference_resource_id: idResource } })
          .done(() => {
            updateRB(CTX)
            $('#reference-resource-dialog').modal('hide')
            CTX.trigger(EVT.STATUS_UPDATED)
            App.ui.toast.success('Id de Referencia actualizado correctamente')
            setTimeout(CTX.updateMenu, 4000)
          })
          .fail(() => {
            App.ui.toast.error('No fue posible actualizar el id de referencia')
          })
      }
    })
    .fail((xhr) => {
      if (xhr.status === 404) {
        App.ui.toast.error('El id de referencia no existe.')
      } else {
        App.ui.toast.error('No fue posible actualizar el id de referencia')
      }
      $('#btn-submit').attr('disabled', false)
    })
}

function deleteReferenceResource() {
  this.setMessage('Actualizando...')
  this.setButtons(App.ui.CLOSE)

  App.server(`requisitions/${CTX.id}`, 'PATCH', { data: { reference_resource_id: null } })
    .done(() => {
      CTX.reference_resource_id = null
      updateRB(CTX, true)
      CTX.trigger(EVT.STATUS_UPDATED)
      App.ui.toast.success('Se ha eliminado el recurso de referencia de la requisición')
      setTimeout(CTX.updateMenu, 4000)
    })
    .fail(() => {
      App.ui.toast.error('Error eliminando el recurso de referencia de la requisición')
    })
    .always(() => {
      this.close()
    })
  return false
}

module.exports = function changeRes(jqev) {
  const ctx = jqev.data
  const elem = jqev.target
  CTX = ctx
  const view = require('./views/action-changeres.pug')

  if (!ctx.user_capabilities['resource-associate']) {
    App.ui.alert('No tienes permitido modificar el id de Referencia')
    return
  }

  if (elem.classList.contains('wb-close-mini')) {
    App.ui.confirm(
      '¿Estás seguro de eliminar el recurso de referencia de la requisición?',
      deleteReferenceResource
    )
    return
  }

  $(view(ctx)).appendTo('#main-page')
    .modal()
    .on('shown.bs.modal', onShowForm)
    .on('hidden.bs.modal', $.selfRemove)
}
