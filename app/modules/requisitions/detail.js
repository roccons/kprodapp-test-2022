
const showRelatedOrders = require('./show-related-orders')

const EVT = require('./evt_ids')

const ACTIONS_ID = '#detail-actions'

function getForm() {
  return getById('detail-form')
}

function getStore() {
  return App.store.get(EVT.STORE)
}

function closeForm() {
  App.goToPage('requisiciones')
}

function copyValue(elToCopy) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange()
    range.moveToElementText(elToCopy)
    range.select()
  } else if (window.getSelection) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(elToCopy)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    console.warn('Could not select text in node: Unsupported browser.')
  }
  document.execCommand('Copy')
}

/*
  Se ejecuta en la inicialización, al cambio de estado y al generar orden
*/
function updateMenu($actions) {

  const updateRelationRBView = require('./update-rb-relation')
  const actions  = ['generate', 'assoc', 'assign', 'delete', 'deassign', 'publish', 'changeres']
  const form      = getForm()
  const ctx       = getStore()
  const btnStatus = form.requis_status
  const canEdit   = btnStatus && App.catalogs.reqStatusEditable(ctx.status)

  if (!$actions || $actions.id) {
    const check = require('scripts/form-access')
    const tmpl  = require('./views/detail-menu.pug')

    $actions = $(ACTIONS_ID).empty().html(tmpl(ctx))
    check($actions.get(0), ctx)

  }

  if (ctx._partials) {
    $actions.children('button')
      .removeClass('-lockstate disabled')
      .prop('disabled', false)
    $('#detail-submit-form').css('display', 'inline-block')
      .click(goEditPartials)

  } else {
    const $btnEdit = $actions.find('.-action-edit')
    if ($btnEdit.length) {
      $btnEdit.off('click')
      if (!hasClass(form, '-readonly')) {
        $btnEdit.click(() => { App.goToPage(`requisicion/${ctx.id}/editar`) })
      }
    }
  }

  // cambiamos el estado del botón de estatus
  if (btnStatus) {
    const setStatusClass = require('./set-status-class')

    setStatusClass(btnStatus, ctx.status)

    if (canEdit) {
      $(btnStatus).off()
        .prop('disabled', false)
        .dropdown()
        .parent().find('ul').off().click(statusClickHandler)
    } else {
      $(btnStatus).off()
        .prop('disabled', true)
        .parent().find('ul').off()
    }
  }
  updateRelationRBView(ctx, true)
  actions.forEach(action => {
    action = 'action-' + action
    const $item = $actions.find('.-' + action)
    if (!$item.hasClass('disabled')) $item.click(ctx, require('./' + action))

    const $itemr = $('#rb-relations').find('.-' + action)
    if (!$itemr.hasClass('disabled')) { $itemr.click(ctx, require('./' + action)) }
  })

  if (ctx.resource_translated_id) {
    $actions.find('.-action-context').click(require('./info-viewer'))
  }
}

/*
  Establece el texto del botón de cambio de estatus, y si se
  publicó inhabilita el botón de edición.
 */
function onStatusUpdated(data) {
  const status = (data || this).status

  if (status) {
    const form = getForm()
    const name = App.catalogs.nameFromId('req_statuses', status)

    $(form.requis_status)
      .data('id', status)
      .find('.caption').text(name)

    updateMenu()
    // se ejecuta nuevamente ya que si se 'vincula rb' Se ejecuta esta función
    // antes de obtener los datos de rb para mostrarlos, lo que hace que el evento
    // del boton desacociar (x) se pierda. Y si se desvincula, al ejecutarse antes,
    // los valores de rb no se actualizaban.
    setTimeout(updateMenu, 4000)

    $('#detail-right-pane').find('.approved-by')
      .text(this.status === $_REQ_ST.READY || this.status === $_REQ_ST.PENDING ? '--' : this.approved_by_str)
  }
}


/**
 * Se ejecuta al seleccionar un nuevo status con el dropdown
 * El estatus COMPLETED no se establece desde aquí.
 *
 * @param {object} ev - jQuery event
 */
function statusClickHandler(ev) {
  if (!hasClass(ev.target, 'link')) {
    return
  }
  const form = getForm()

  ev.preventDefault()

  const validateURL = require('scripts/lib/validateURL')
  const oldStatus = $(form.requis_status).data('id')
  const newStatus = ev.target.getAttribute('data-id')

  const ctx = getStore()

  if (newStatus === oldStatus || !newStatus) {
    return
  }

  if (newStatus === 'AA' && ctx.file_origin === 'URL') {
    if (!ctx.example) {
      App.ui.toast.error('El campo "Link" es requerido.')
      return
    } else if (!validateURL(ctx.example) && !/^\{\{[\s*|\w*|\W*]*\}\}$/i.test(ctx.example)) {
      App.ui.toast.error(
        'El campo "Link" debe tener una URL válida o una cadena de texto con el siguiente formato: "{{ texto }}".'
      )
      return
    }
  }

  if (newStatus !== $_REQ_ST.CANCELED) {
    doChange()
  } else {
    App.ui.yesNo('¿Estás seguro que deseas cancelar esta requisición?', doChange)
  }

  function doChange() {
    form.requis_status.disabled = true

    const req = { status: newStatus, file_origin: ctx.file_origin, example: ctx.example }

    App.server(`/requisitions/${ctx.id}`, 'PATCH', { data: req })
      .done(res => {
        ctx.status = res.status
        if (res.user_capabilities) ctx.user_capabilities = res.user_capabilities
        ctx.trigger(EVT.STATUS_UPDATED)
        App.ui.toast.success('Estatus actualizado exitosamente.')
      })
      .fail(xhr => {
        const message = App.server.errStr(xhr)
        if (message.includes('Aprobado por')) {
          form.requis_status.disabled = false
        }
        App.ui.toast.error(`Error actualizando el estatus: ${message}`)
      })
  }
}

function renderClassificationKB(classification, language) {
  const dict = App.catalogs.get('classification_kb_dictionary_' + language.toLowerCase())
  const tableClassif = require('./views/classificationkb.pug')

  $('#classificationkb-table')
    .empty()
    .html(tableClassif({
      classification,
      dict,
      isPageEdit: false
    }))
}

function renderGlobalKnotion(ctx) {
  const globalKnotion = ctx.global_knotion || []
  const knotionCat = App.catalogs.get('global_knotion')
  const iconUrlBase = App.config.IMG_BASE
  const globalKNName = ctx.language === 'ES' ? 'name' : 'name_en'
  const view = require('./views/global-knotion.pug')

  $('#global-knotion')
    .empty()
    .html(view({
      globalKnotion,
      knotionCat,
      iconUrlBase,
      globalKNName,
      isPageEdit: false
    }))
}

function actionApprove() {
  const ctx = getStore()
  const act = hasClass(this, '-action-approve') ? 1 : 0
  $(this.parentNode).find('button').prop('disabled', true)
  App.server(`/requisitions/${ctx.id}/versionHistory/${ctx.review_data.number}/approve/${act}`, 'PATCH')
    .done(() => {
      if (act) {
        App.ui.toast.success('Cambio de versión aprobado.')
      } else {
        App.ui.toast.info('El cambio se ha descartado.')
      }
      App.goToPage(location.hash, true)
    })
    .fail(xhr => {
      $(this.parentNode).find('button').prop('disabled', false)
      App.server.showError(xhr)
    })
}


function savePartials() {
  const ctx = getStore()
  const form = this.form
  const data = {}
  let has = 0
  let value

  if (form.resource_title && form.resource_title.value) {
    value = form.resource_title.value.trim()
    if (value !== ctx.resource_title && ++has) {
      data.resource_title = value
    }
  }
  if (form.script_storyboard) {
    value = form.script_storyboard.value.trim()
    if (value !== ctx._storyboard && ++has) {
      data.requisition_properties = [{ name: 'script_storyboard', value }]
    }
  }
  if (form.assigned_editor) {
    value = form.assigned_editor.easySelect().getValue()
    if (value && value !== ctx.assigned_editor && ++has) {
      data.assigned_editor = value
      data.assigned_editor_str = App.catalogs.nameFromId('users', data.assigned_editor)
    }
  }
  if (form.f_process_type) {
    value = form.f_process_type.easySelect().getValue()
    if (value && value !== ctx.process_type && ++has) {
      data.process_type = value
    }
  }
  if (has) {
    App.server(`/requisitions/${ctx.id}`, 'PATCH', { data })
      .done(() => {
        App.goToPage(location.hash, true)
        App.ui.toast.success('Datos actualizados exitosamente.')
      })
      .fail(App.server.showError)
  } else {
    cancelPartials.call(getById('detail-cancel-form'))
  }
}

function cancelPartials() {
  const ctx = getStore()
  const form = this.form

  if (form.resource_title) {
    form.resource_title.readOnly = true
    form.resource_title.value = ctx.resource_title
  }
  if (form.script_storyboard) {
    form.script_storyboard.readOnly = true
    form.script_storyboard.value = ctx._storyboard
  }
  if (form.assigned_editor) {
    const parent = form.assigned_editor.parentNode
    form.assigned_editor.easySelect().setValue(ctx.assigned_editor)
    parent.classList.add('hidden')
    parent.nextSibling.classList.remove('hidden')
  }

  if (form.f_process_type) {
    const parent = form.f_process_type.parentNode
    form.f_process_type.easySelect().setValue(ctx.process_type)
    parent.classList.add('hidden')
    // getById('f_process_type').parentNode.classList.add('hidden')
    $('#process-type-text').removeClass('hidden')
  }

  if (form.__statusEnabled) $('#status-button').prop('disabled', false)
  form.classList.remove('-editmode')
  $('#detail-submit-form').html('<span>EDITAR</span>')
    .addClass('wb-pencil btn-text-icon').removeClass('bold btn-success')
  $('#detail-submit-form').off().click(goEditPartials)
  $(this).off()
}

function goEditPartials() {
  const form = this.form
  this.title = 'Guardar'
  let focus

  form.classList.add('-editmode')
  $('#detail-submit-form').text('GUARDAR')
    .removeClass('wb-pencil btn-text-icon').addClass('bold btn-success')
  form.__statusEnabled = !$('#status-button').prop('disabled')
  $('#status-button').prop('disabled', true)
  $('#detail-cancel-form').off().click(cancelPartials)
  $(this).off().click(savePartials)

  if (form.resource_title) {
    form.resource_title.readOnly = false
    focus = focus || 'resource_title'
  }

  if (form.f_process_type) {
    // form.f_process_type.disabled = false;
    const parent = form.f_process_type.parentNode
    parent.classList.remove('hidden')
    parent.classList.remove('disabled')
    form.f_process_type.disabled = false
    form.f_process_type.classList.remove('disabled')
    getById('process-type-text').classList.add('hidden')
    focus = focus || 'f_process_type'
  }
  if (form.script_storyboard) {
    form.script_storyboard.readOnly = false
    focus = focus || 'script_storyboard'
  }
  if (form.assigned_editor) {
    const parent = form.assigned_editor.parentNode
    parent.classList.remove('hidden')
    parent.nextSibling.classList.add('hidden')
    focus = focus || 'assigned_editor'
  }
  if (focus) {
    form[focus].focus()
  }
}

function showLinkWarning(ctx) {

  let msg = ''
  let showAlert = false
  if (ctx.resource_type === 'Link' && ctx.file_origin !== 'URL') {
    msg = 'En los recursos de tipo "Link" es necesario que el origen sea ' +
          'también tipo "Link" para que pueda ser publicado hacia Resource Bank'
    showAlert = true
  }
  if (ctx.file_origin === 'URL') {
    msg = 'Los recursos con origen "Link" no generan órdenes de producción, ' +
          'en cambio pueden ser publicados directamente hacia Resource Bank'
    showAlert = true
  }
  const alert = `<div class='alert alert-warning'><span class="icon fa-warning"> </span> ${msg}</div>`

  if (showAlert) {
    $('#form-error-box').html(alert)
  }
}


function initForm(el, ctx) {
  const formAccess = require('scripts/form-access')
  const historyTab = require('./detail-history')

  $('#detail-right-pane').find('select').easySelect()
  if (~ctx._partials.indexOf('a')) {
    getById('f_assigned_editor').parentNode.classList.add('hidden')
  }

  showLinkWarning(ctx)

  formAccess(getForm(), ctx)

  historyTab(ctx)

  if (ctx._partialStatus) {
    $('#status-button').prop('disabled', false).removeClass('disabled -lockstate')
  }

  if (ctx.user_capabilities['processtype-edit']) {
    $('#f_process_type').easySelect()
    getById('f_process_type').parentNode.classList.add('hidden')
  }

  $('#btn-show-more').on('click', function (e) {
    e.preventDefault()
    e.target.nextElementSibling.classList.toggle('hidden')
    return false
  })

  ctx.updateMenu = updateMenu

  if (ctx.file_origin === 'URL') {
    getById('label-example').textContent = 'Link'
  } else if (ctx.file_origin === 'KNRA') {
    getById('label-example').textContent = 'URL Scheme'
  }
}


function setHandlers(ctx) {
  const form = getForm()
  const $actions = $(ACTIONS_ID)

  $(form).submit(false)

  updateMenu($actions) // los permisos de los menús son independientes del form
  if (ctx.needs_review) {
    if (ctx.user_capabilities['change-approve']) {
      $('#detail-main').find('.-action-refuse,.-action-approve').click(actionApprove)
    }
    return
  }

  if (form.requis_status) {
    ctx.on(EVT.STATUS_UPDATED, onStatusUpdated)
  }

  if (ctx._partials) {
    $actions.children('button')
      .removeClass('-lockstate disabled')
      .prop('disabled', false)
    $('#detail-submit-form').css('display', 'inline-block')
      .click(goEditPartials)

  } else if (!hasClass(form, '-readonly')) {
    $('#detail-nav-tabs').on('shown.bs.tab', (ev) => {
      const editable = hasClass(ev.target.parentNode, '-can-edit')
      getForm().classList.toggle('-editable', editable)
    })
  }
}

/*
  Implementar nuevos permisos del GET /requisition/{id}
  - status-EE-RR    : Cambiar estatus entre Ready to review y Pending to edit
  - title-edit      : Editar título
  - storyboard-edit : Editar propiedad script_storyboard
  - assign-editor   : Asignar un editor
*/
function setPartialEdit(ctx, caps) {
  if (ctx.status !== $_REQ_ST.COMPLETED) {
    const rp = ctx.requisition_properties

    let partials = ''
    if (caps['status-EE-RR'] && /^(EE|RR)/.test(ctx.status)) ctx._partialStatus = true
    if (caps['title-edit']) partials += 't'
    if (caps['assign-editor']) partials += 'a'
    if (caps['processtype-edit']) partials += 'p'

    for (let i = 0; i < rp.length; i++) {
      if (rp[i].name === 'script_storyboard') {
        if (caps['storyboard-edit']) {
          partials += 's'
          ctx._storyboard = rp[i].value
          rp.splice(i, 1)
        }
        break
      }
    }

    ctx._partials = partials
  }
}

module.exports = function (el, ctx, promise) {

  promise.then(
    (res) => {
      const preprocData = require('./models/preproc-data')
      const view = require('./views/detail.pug')
      const processTypes = App.catalogs.get('process_types')
      const urlFormatter = App.pusher.urlFormatter
      // const loadInfoResourceBank = require('./update-rb-relation')
      const relatedOrdersModal = require('shared/related-orders-modal')

      ctx.processTypesText = {
        none: '(Proceso no especificado)',
        use: 'Usar recurso sin cambios',
        edit: 'Actualizar recurso existente',
        new: 'Nuevo recurso a partir de uno existente'
      }

      res.canDestroy = function () {
        return !~location.hash.indexOf(`requisicion/${this.id}/editar`)
      }

      assign(ctx, preprocData(res))
      App.store.add(EVT.STORE, ctx)

      const caps = ctx.user_capabilities

      if (ctx.needs_review && !ctx.review_data) {
        ctx.needs_review = 0
      }

      if (caps['change-ask']) {
        delete caps['change-ask']
        if (!caps.edit) {
          if (!ctx.needs_review) caps.edit = true
          ctx._is_change_ask = true
        }
      }
      ctx._partials = ''
      if (!caps.edit && !ctx.needs_review) {
        setPartialEdit(ctx, caps)
      }

      if (ctx.production_key == null) {
        require('scripts/read-prod-key')(ctx)
      }

      if (ctx.order_id) {
        ctx.board_url = urlFormatter({
          model_type: 'order',
          grade: ctx.grade,
          challenge: ctx.challenge,
          model_id: ctx.order_id
        })
      }
      ctx.processTypes = processTypes

      // loadInfoResourceBank(ctx, null, updateMenu)

      $(el).html(view(ctx))

      initForm(el, ctx)
      setHandlers(ctx)

      ctx.trigger(EVT.MODULE_STARTED)

      $('#link_krb_resource_id').click(function (event) {
        event.preventDefault()
        copyValue(this.previousElementSibling)
      })

      renderClassificationKB(ctx.classificationkb, ctx.language)
      renderGlobalKnotion(ctx)

      showRelatedOrders(ctx.id)

      $('#requisition-related-orders-button').click(function (event) {
        relatedOrdersModal(event, ctx, 'requisition', showRelatedOrders)
      })
    },
    (xhr) => {
      App.ui.toast.error(App.server.errStr(xhr))
      closeForm()
    }
  )

}

module.exports.preloader = function (data) {

  if (!data.params.id) {
    App.ui.alert('Se necesita el ID de la requisición.', closeForm)
    return false
  }

  return App.server(`/requisitions/${data.params.id}`)
}
