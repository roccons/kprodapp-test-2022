/*
  DEV URL_BASE: 'http://localhost:8080',
  STG URL_BASE: 'https://stg-knotionworkflow.us-west-2.elasticbeanstalk.com'
*/
const dateFormat  = require('scripts/lib/dates').dateTimeFormat
const BT_PREFIX   = 'action-assign'
const DIALOG_ID   = `#${BT_PREFIX}-dialog`

const EVT = require('./evt_ids')

function getStore() {
  return App.store.get(EVT.STORE)
}

const columns = [
  {
    field: 'idResource_int',
    title: 'ID',
    class: 'no-break text-center',
    sortable: true,
    order: 'desc'
  }, {
    field: 'title',
    title: 'Título del recurso',
    sortable: true,
    order: 'desc',
    class: 'min-width-medium'
  }, {
    field: 'createTime',
    title: 'Fecha de creación',
    sortable: true,
    order: 'asc',
    formatter: dateFormat
  }, {
    field: 'resourceType',
    title: 'Tipo del recurso',
    sortable: true,
    order: 'desc'
  }, {
    field: 'idResource_int',
    title: '',
    titleTooltip: 'Enlace externo',
    class: 'has-link',
    sortable: false,
    formatter: linkFmt
  }
]
const session = require('store2').session
const KRB_AUTH = `${session.get('user-info').idUser}:${App.config.KRB_API_KEY}`

function linkFmt(id, row) {
  const module = row.resourceTypeCode === 'AST' ? 'asset' : 'recurso'
  return `<a href="${App.config.KRB_URL_BASE}/${module}/${id}" class="fa-external-link" target="_blank"></a>`
}

function onShowForm() {
  const $box = $(this)
  const $fld = $box.find('.search input')
  $fld.attr('placeholder', 'Buscar recurso existente').focus()
}

function close(self, $dialog, ctx, reso, res = false) {
  const view = require('./views/detail-info-ids.pug')
  const updateRB = require('./update-rb-relation')
  ctx.krb_resource_id = reso.idResource_int
  ctx.krb_resource_type = reso.resourceTypeCode
  ctx.krb_resource_title = reso.title
  // eslint-disable-next-line no-unused-expressions
  res ? ctx.resource_id = res.resource_id : null
  // eslint-disable-next-line no-unused-expressions
  res ? ctx.status = res.status : null

  // eslint-disable-next-line no-unused-expressions
  ctx.fromCreateRequisition
    ? updateRB(ctx, false, ctx.enableSetKRBRelations) : updateRB(ctx)

  self.close()
  $dialog.modal('hide')
  $('#detail-form').find('.info-ids').html(view(ctx))
  ctx.trigger(EVT.STATUS_UPDATED)
  App.ui.toast.success('El recurso se vinculó exitosamente.')

  $('[name="krb_resource_id"]').val(reso.idResource_int)
}

function onClickRow(reso, tr) {

  if (tr && tr.context && hasClass(tr.context, 'has-link')) {
    return
  }
  const $dialog  = $(DIALOG_ID)
  const requisId = this.requisId
  const resourceId = reso.idResource_int
  const ctx = getStore()

  App.ui.yesNo(`¿Deseas vincular el recurso "${reso.title}" a la requisición "${ctx.resource_title}"?`,
    function () {

      if (ctx.fromCreateRequisition) {
        close(this, $dialog, ctx, reso)

        return false
      }

      $dialog.find('.submit-form').prop('disabled', true)
      this.setMessage('Asignando...')
      this.setButtons(App.ui.CLOSE)

      App.server(`/requisitions/${requisId}/associateToResource/${resourceId}`, 'POST')
        .done(res => {
          close(this, $dialog, ctx, reso, res)
        })
        .fail(xhr => {
          $dialog.find('.submit-form').prop('disabled', false)
          this.setMessage(`Error asignando el recurso: ${App.server.errStr(xhr)}`)
        })

      return false  // do not close the confirm
    })
}

module.exports = function actionAssign(jqev) {
  const ctx  = assign({ prefix: BT_PREFIX, title: 'Vincular recurso de Resource Bank' }, jqev.data)
  const view = require('./views/action-dialog.pug')
  const init = require('scripts/table-init')

  $(DIALOG_ID).remove()

  if (!ctx.user_capabilities['resource-associate']) {
    App.ui.alert('No tienes permitido vincular un recurso a esta requisición.')
    return
  }

  $(view(ctx)).appendTo('#main-page')
    .modal()
    .on('shown.bs.modal', onShowForm)
    .on('hidden.bs.modal', $.selfRemove)

  init(BT_PREFIX, '', {
    url: App.config.KRB_API_BASE + '/resources',
    columns,
    uniqueId: 'idResource_int',
    requisId: ctx.id,
    toolbar: '',
    condensed: true,
    showColumns: false,
    showRefresh: false,
    showToggle: false,
    searchAlign: 'left',
    onClickRow,
    queryParams: qp => {
      qp.show_apps = true

      return qp
    }
  })

}
