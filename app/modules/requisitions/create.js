/*
  ReadOnly:
  Reto, Nivel + grado, Clave de localización, Solicitante, Fecha de solicitud, País, Ciclo

  [9:52 PM] Rodrigo: pues en efecto debe ser el mismo formulario
  [9:52 PM] Rodrigo: la única diferencia es que si no vienes de autoría los campos de clave
            de localización, reto y demás van nulos (y opcionalmente podrían no mostrarse)
*/

const EVT = require('./evt_ids')
const validateURL = require('scripts/lib/validateURL')
const getResource = require('scripts/get-resource')
const updateRelationRBView = require('./update-rb-relation')

const SUBMIT_BTN_ID = '#detail-submit-form'
const CANCEL_BTN_ID = '#detail-cancel-form'
const FILE_ORIGIN_LINK = 'Link'
const FILE_ORIGIN_KNRA = 'KNRA'
const URL_SCHEME_PREFIX = 'immersive://'

// eslint-disable-next-line max-len
const CHANGE_VERSION_MSG = 'Al elegir una nueva versión de recurso cambiarán sus propiedades adicionales<br>¿Estás seguro que deseas proceder?'

const getForm = () => getById('detail-form')

// fromAuth es true y ctx un objeto si estamos ejecutando desde preloader
function closeForm(fromAuth, ctx) {
  if (fromAuth !== true || typeof ctx != 'object') {
    ctx = getStore()
    fromAuth = ctx ? ctx._fromAuth : hasClass(document.body, '-from-auth')
  }
  if (ctx && ctx.__duplicated) {
    fromAuth = true
  }
  if (fromAuth) {
    const bye = require('./views/bye-auth.pug')
    $('#main-page').empty().html(bye(ctx))
  } else {
    const _id = ctx && ctx._isPatch ? ctx.id : 0
    App.goToPage(_id ? `requisicion/${_id}` : 'requisiciones')
  }
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

function getStore() {
  return App.store.get(EVT.STORE)
}


function cleanValue(fld) {
  return fld.value && fld.value.trim().replace(/\n/g, '<br>').replace(/\s+/g, ' ') || ''
}


// Actualiza el estado del botón "Guardar"
function updateSaveForm() {
  const form = getForm()
  const save = hasClass(form, 'dirty') ||
    hasClass(form, 'dirty-status') ||
    form.classificationkbChanges ||
    form.globalKnotionChange

  $(SUBMIT_BTN_ID).prop('disabled', !save)
}


function submitForm(ctx, data) {
  const method = ctx._isPatch ? 'PATCH' : 'POST'
  const url = '/requisitions' + (ctx._isPatch ? `/${ctx.id}` : '')

  $('#detail-actions').find('button').prop('disabled', true)

  App.server(url, method, { data })
    .done(res => {
      if (!ctx._fromAuth) {
        const msg = `La requisición se ${ctx._isPatch ? 'actualizó' : 'creó'} exitosamente`
        App.ui.toast.success(msg)
      }
      ctx.id = res.id || 1
      if (ctx.__duplicated) ctx.__duplicated = 3
      closeForm()
    })
    .fail(xhr => {
      ctx.__errors = true
      App.ui.alert(`Error guardando la requisición: ${App.server.errStr(xhr)}`)
    })
    .always(() => {
      $('#detail-actions').find('button').prop('disabled', false)
    })
}

// eslint-disable-next-line complexity
function saveForm(evt) {
  const tokensAsArray = require('scripts/tokens-as-array')
  const form = this.form
  const ctx = getStore()
  const fields = Object.create(App.config.REQ_SPECS_FIELDS)
  const errors = []

  if (evt) evt.preventDefault()

  // Propiedades comunes a POST y PATCH en modo edición completa.
  // La edición completa se determinó exclusivamente en base al status.
  const data = ctx._fullEdit ? {
    resource_title: cleanValue(form.resource_title),
    visible_for_student: ~~form.visible_for_student.checked,
    visible_for_parent: ~~ctx.visible_for_parent,
    visible_for_coach: ~~ctx.visible_for_coach,
    is_mathematics: ~~form.is_mathematics.checked,
    is_coach: ~~form.is_coach.checked,
    is_translation: ~~form.is_translation.checked,
    responsible: form.responsible.easySelect().getValue(),
    assigned_editor: form.assigned_editor ? form.assigned_editor.easySelect().getValue() : null,
    reviewed_by: form.reviewed_by ? form.reviewed_by.easySelect().getValue() : null,
    minimum_age: ~~form.minimum_age.easySelect().getValue(),
    maximum_age: ~~form.maximum_age.easySelect().getValue(),
    status: form.requis_status && $(form.requis_status).data('id') || ctx.status,
    classificationkb: form.classificationkb,
    global_knotion: form.globalKnotion
  } : {}

  if (ctx.fromCreateRequisition && cleanValue(form.krb_resource_id)) {
    data.krb_resource_id = cleanValue(form.krb_resource_id)
  }

  if (ctx.fromCreateRequisition && cleanValue(form.reference_resource_id)) {
    data.reference_resource_id = cleanValue(form.reference_resource_id)
  }

  // valores para challenge, cicle, grade, language, pathway y session
  if (!ctx._fromAuth && !ctx.resource_translated_id) {
    data.cicle = form.cicle.easySelect().getValue()
    data.grade = form.grade.easySelect().getValue()
    data.language = form.language.easySelect().getValue()
    data.pathway = form.pathway.easySelect().getValue()
    data.challenge = form.challenge.easySelect().getValue()
    data.session = form.session.value
  }

  data.resource_version_id = ~~form.resource_version_id.easySelect().getValue()
  if (!data.resource_version_id) {
    const inf = !form.resource_type_group_id.value ? 'la <a data-link="resource_type_group_id">categoría'
      : !form.resource_type_id.value ? 'el <a data-link="resource_type_id">tipo'
      : 'la <a data-link="resource_version_id">versión'
    errors.push(`Selecciona ${inf}</a> del recurso.`)
  }

  if (ctx._isPatch && data.resource_version_id !== ctx.resource_version_id) {
    data.change_resource_version = true
  }

  if (ctx._fromAuth) {
    data.resource_translated_id = ctx.resource_translated_id
  }
  data.process_type = ctx.process_type
  // al editar un recurso con proveniente de autoría
  // se agrega processType a los campos
  if (ctx.user_capabilities['processtype-edit']) {
    fields.push(
      {
        name: 'process_type',
        translation: 'Process Type',
        input_type: 'select'
      }
    )
  }

  if (ctx._fullEdit) {
    if (!data.resource_title) {
      errors.push('<a data-link="resource_title">El título</a> de la requisición no puede estar en blanco.')
    }
    if (!data.status) {
      errors.push('Selecciona el <a data-link="requis_status">estatus</a> de la requisición.')
    } else if (!App.catalogs.reqStatusEditable(data.status)) {
      errors.push('El <a data-link="requis_status">estatus</a> de la requisición no es válido.')
    }
    if (data.responsible) {
      data.responsible_str = App.catalogs.nameFromId('users', data.responsible)
    } else {
      errors.push('El <a data-link="responsible">Productor responsable</a> es requerido.')
    }
    if (data.assigned_editor) {
      data.assigned_editor_str = App.catalogs.nameFromId('users', data.assigned_editor)
    } else {
      delete data.assigned_editor
    }
    if (data.reviewed_by) {
      data.reviewed_by_str = App.catalogs.nameFromId('users', data.reviewed_by)
    } else {
      delete data.reviewed_by
    }
    if (!ctx._fromAuth && !ctx.resource_translated_id) {
      if (!data.cicle) {
        errors.push('El <a data-link="cicle">Ciclo</a> es requerido.')
      }
      if (!data.grade) {
        errors.push('El <a data-link="grade">Grado</a> es requerido.')
      }
      if (!data.language) {
        errors.push('El <a data-link="language">Idioma</a> es requerido.')
      }
      if (!data.challenge) {
        errors.push('El <a data-link="challenge">Reto</a> es requerido.')
      }
      if (!data.session) {
        errors.push('La <a data-link="session">Sesión</a> es requerida.')
      }
    }

    // validaciones para file_origin = URL
    const fileOrigin = cleanValue(form.f_file_origin)
    if (fileOrigin === FILE_ORIGIN_LINK) {
      const samples = cleanValue(form.f_example)

      if (!samples) {
        if (ctx.status === 'AA') {
          errors.push('El campo <a data-link="samples">Ejemplos/Link</a> es requerido.')
        }
      } else if (!validateURL(samples) && !/^\{\{[\s*|\w*|\W*]*\}\}$/i.test(samples)) {
        errors.push(
          'El campo <a data-link="samples">Ejemplos/Link</a> debe ser una URL válida ' +
          'o una cadena de texto con el siguiente formato: "{{ texto }}".'
        )
      }
    }

    if (fileOrigin === FILE_ORIGIN_KNRA) {
      const samples = cleanValue(form.f_example)

      if (samples && !/^\S*$/.test(samples)) {
        errors.push(
          'El campo <a data-link="samples">URL Scheme</a> no puede contener espacios'
        )
      }
    }

    fields.forEach(p => {
      const ff = form[`f_${p.name}`]
      data[p.name] = hasClass(ff, 'has-tokens') ? tokensAsArray(ff).join(',')
                   : ff.easySelect ? ff.easySelect().getSelValues().join(',')
                   : cleanValue(ff)

      // En caso de que sea origin KNRA se agrega el prefijo URL_SCHEME_PREFIX
      if (p.name === 'example' && fileOrigin === FILE_ORIGIN_KNRA) {
        data[p.name] = `${URL_SCHEME_PREFIX}${cleanValue(ff)}`
      }

      if (p.required && !data[p.name]) {
        if (p.name === 'production_id' && ctx.production_id === 2) { // outsourcing mandaraka
          data[p.name] = ctx.production_id
          return
        }
        if (!getById('label-script').classList.contains('required')) {
          return
        }
        errors.push(`El campo <a data-link="f_${p.name}">${p.translation}</a> es requerido.`)
      }
    })
  }

  // si la versión cambió, NO enviar las PA si el usuario es changhe-ask
  const send_props = data.change_resource_version ? !ctx._is_change_ask : true

  // Extrae el valor de las propiedades adicionales
  if (send_props && data.resource_version_id) {
    data.requisition_properties = ctx._extraProps.map(p => {
      const ff = form[`ap_${p.name}`]
      const value = p.input_type === 'radio' ? $(ff).filter(':checked').val()
                  : p.input_type === 'checkbox' ? ~~ff.checked
                  : p.input_type === 'Tokenfield' ? tokensAsArray(ff).join(',')
                  : ff.easySelect ? ff.easySelect().getSelValues().join(',')
                  : cleanValue(ff)
      if (p.required && !value) {
        errors.push(`La propiedad adicional <a data-link\x3D"ap_${p.name}">${p.translation}</a> es requerida.`)
      }
      return {
        name: p.name,
        value: value || ''
      }
    })
  } else {
    delete data.requisition_properties
  }

  if (errors.length) {
    const formErrors = require('scripts/form-errors')
    formErrors('#form-error-box', errors)
  } else {
    showProcessTypeMessage(ctx, data, submitForm)
  }


  return false // avoid auto-submit
}

/*
 Muestra mensaje de eliminación de Id de Resource Bank si cambió el process type
 de use o edit a new
 */
function showProcessTypeMessage(ctx, data, cb) {
  if ((~~ctx.process_type === 1 || ~~ctx.process_type === 2) &&
    ~~data.process_type === 3 && ctx.krb_resource_id) {

    const view = require('./views/link-krb.pug')

    $('#main-page').append(view({
      krbId: ctx.krb_resource_id,
      krbResType: ctx.krb_resource_type === 'Asset' ? 'asset' : 'recurso'
    }))

    $('#link-to-krb').on('hidden.bs.modal', function () {
      cb(ctx, data)
      // $.selfRemove()
    }).modal()

  } else {
    cb(ctx, data)
  }
}

/*
  _state.last_version contiene la última versión seleccionada.
  Si este valor no es cero, ni la última versión puesta, ni la versión original
  del recurso, se preguntará al usuario si está seguro de querer cambiarla.
 */
function updateExtraProps(jqev) {
  const resetSelects = require('./reset-selects')
  const ctx = getStore()
  const _st = ctx._state
  const ctl = jqev.target
  const num = ctl.name === 'resource_type_group_id' ? 1
            : ctl.name === 'resource_type_id' ? 2
            : 3
  const ver = num === 3 ? ~~ctl.easySelect().getValue() : 0

  if (ctx._is_change_ask) {
    const disab = ctx.resource_version_id !== ver
    $('#detail-extra-props').find('textarea,input,select').each(function () {
      const _this = this
      if (_this.nodeName === 'SELECT') _this.easySelect()._setEasyDisab(disab)
      else _this.disabled = disab
    })
    if (num === 1) resetSelects(ctx, getForm().resource_type_group_id)
    if (num === 2) resetSelects(ctx, getForm().resource_type_id)

  } else if (_st.last_version > 0 &&
    _st.last_version !== ver && ctx.resource_version_id !== ver && ver > 0) {
    App.ui.confirm(CHANGE_VERSION_MSG, _update, _undo)

  } else {
    _update()
  }

  if (jqev.target.name === 'resource_type_id') {
    getById('label-script').classList.remove('required')
    if (jqev.target.value !== 'Alliances') {
      getById('label-script').classList.add('required')
    }
  }

  function _undo() {
    const last = ['last_goup', 'last_type', 'last_version'][num - 1]
    ctl.easySelect().setValue(_st[last], true).updateText()
  }

  function _update() {
    const form = getForm()
    $('#detail-extra-props').empty()
    ctx._extraProps = []
    _st.last_version = ver // evita el doble diálogo

    if (num === 1) resetSelects(ctx, form.resource_type_group_id)
    if (num === 2) resetSelects(ctx, form.resource_type_id)
    if (ver) {
      App.server(`/resourceVersions/${ver}/properties`)
        .done(res => {
          if (Array.isArray(res)) {
            const view = require('./views/create-extra-props.pug')
            const src = ctx.requisition_properties

            ctx._extraProps = res
            res.forEach(p => {
              const v = src.find(x => x.name === p.name)
              p.value = v ? v.value : ''
            })
            $('#detail-extra-props').empty().html(view(ctx))
              .find('select').easySelect({
                size: 9
              }).end()
              .find('.has-tokens').tokenfield()
              .filter('[required]')
              .change(checkTokens)
              .change()
            checkStoryboard()
          }
          if (ctx.resource_version_id === ver) {
            setImmediate(() => {
              $(getForm()).trigger('rescan.areYouSure')
            })
          }
        })
        .fail(xhr => {
          App.ui.alert(`Error leyendo propiedades adicionales: ${App.server.errStr(xhr)}`)
        })
    }
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
      isPageEdit: true
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
      isPageEdit: true,
    }))
}

function statusClickHandler(ev) {
  const form = getForm()
  const button = form.requis_status

  if (!button || hasClass(ev.target, 'link')) {
    return
  }
  const setStatusClass = require('./set-status-class')
  const status = ev.target.getAttribute('data-id') // nuevo status en el LI del click

  setStatusClass(button, status)

  if (status) {
    const name = App.catalogs.nameFromId('req_statuses', status)

    $(button)
      .data('id', status)
      .find('.caption').text(name)

  } else {
    $(button).data('id', '').find('.caption').text('(nulo)')
  }

  form.classList.toggle('dirty-status', getStore().status !== status)
  updateSaveForm()
}


/*
  Usado por initForm y updateExtraProps como handler jQuery de tokenfield
  para evento si el campo requerido no tiene contenido le establece la class 'invalid'.
*/
function checkTokens() {
  $(this).closest('.tokenfield').toggleClass('invalid', !this.value)
}


function checkAges() {
  const form = this.form
  const minAge = form.minimum_age.value | 0
  const maxAge = form.maximum_age.value | 0
  if (minAge > maxAge) form.maximum_age.easySelect().setValue(minAge)
}

function cancelForm() {
  if (hasClass(this.form, 'dirty')) {
    const addmsg = getStore().__duplicated
                  ? 'La requisición permanecerá sin cambios.'
                  : 'La requisición no se guardará.'
    App.ui.confirm('¿Deseas cancelar?<br>' + addmsg, closeForm)
  } else {
    closeForm()
  }
}

function changeSampleLabel(select) {
  const el = getById('label-example')

  switch (select.value) {
    case 'URL':
      el.textContent = 'Link *'
      changeInputForExample()
      break
    case 'KNRA':
      el.textContent = 'URL Scheme'
      changeInputForURLScheme()
      break
    default:
      el.textContent = 'Ejemplos'
      changeInputForExample()
      break
  }
}

function changeInputForURLScheme() {
  const $textArea = $('#f_example')
  const $parent = $textArea.parent('div')
  const value = $textArea.val() ? $textArea.val().replace(URL_SCHEME_PREFIX, '') : false
  const newInput = `
    <input
      class="form-control"
      name="${$textArea.attr('name')}"
      id="${$textArea.attr('id')}"
      tabindex="${$textArea.attr('tabindex')}"
      value="${value ? value : ''}"
    >

    <span>
      ${URL_SCHEME_PREFIX}
    </span>
  `

  $parent.addClass('input-url-scheme')
  $parent.empty()
  $parent.append(newInput)
}

function changeInputForExample() {
  const $input = $('#f_example')
  const $parent = $input.parent('div')
  const newTextArea = `
    <textarea
      class="form-control"
      name="${$input.attr('name')}"
      id="${$input.attr('id')}"
      tabindex="${$input.attr('tabindex')}"
      rows="3"
    >${$input.val()}</textarea>
  `

  $parent.removeClass('input-url-scheme')
  $parent.empty()
  $parent.append(newTextArea)
}

/*
  [Dec 8, 2016] Rodrigo:
  Cuando una requisición ya tiene estatus de producción (PP PO o PK) ya solamente
  se debe permitir editar la versión de recurso y sus propiedades adicionales.
*/
function initForm(ctx) {
  const form = getForm()
  const $form = $(form)

  // inicializa los SELECTs y tokenfields ya puestos en el form.
  $form.submit(false)
    .find('select').easySelect({
      size: 9
    }).end()
    .find('.has-tokens').tokenfield()
    .filter('[required]')
    .change(checkTokens)
    .change()

  // handler de estatus, solamente si es editable
  if (form.requis_status && App.catalogs.reqStatusEditable(ctx.status)) {
    $(form.requis_status).dropdown().parent().find('ul').click(statusClickHandler)
  }

  changeSampleLabel(form.easy_f_file_origin)

  form.easy_f_file_origin.onchange = function () {
    changeSampleLabel(this)
  }

  ctx._state.last_group = ctx.resource_type_group_id
  ctx._state.last_type = ctx.resource_type_id
  ctx._state.last_version = ctx.resource_version_id

  // sincroniza los selects si hay valores seleccionados
  // but only if this is not an update request
  $(form.resource_type_group_id).change(updateExtraProps)
  $(form.resource_type_id).change(updateExtraProps)
  $(form.resource_version_id).change(updateExtraProps)

  // Si hay una versión leída de Autoría, es necesario inicializar
  // las propiedades adiciones para lo que usamos un change()
  if (ctx.resource_version_id && ctx._fromAuth) {
    $(form.resource_version_id).change()
  }

  // handlers para conservar los límites de edad sincronizados
  $(form.minimum_age).change(checkAges)
  $(form.maximum_age).change(checkAges)

  if (ctx.resource_translated_id && form.f_language) {
    form.f_language.easySelect().disable()
  }

  $(SUBMIT_BTN_ID).click(saveForm)
  $(CANCEL_BTN_ID).click(cancelForm)

  // ClassificationKB
  renderClassificationKB(
    ctx.classificationkb ? ctx.classificationkb : [],
    ctx.language ? ctx.language : 'ES'
  )

  form.initialClassificationkb = assign([], ctx.classificationkb)

  // GlobalKnotion
  renderGlobalKnotion(ctx)
  form.initialGlobalKnotion = assign([], ctx.global_knotion)
  form.globalKnotion = assign([], ctx.global_knotion)

  // Bloque de ordenes relacionadas
  const showRelatedOrders = require('./show-related-orders')
  showRelatedOrders(ctx.id)

  // Durante la edición desde Autoría, el botón "Guardar" siempre está habilitado
  if (ctx._fromAuth) {
    $form.addClass('dirty')
  } else {
    $form
      .on('clean.areYouSure', updateSaveForm)
      .on('dirty.areYouSure', updateSaveForm)
      .areYouSure({
        silent: true
      })
    updateSaveForm()
  }

  $('#link_krb_resource_id').click(function (event) {
    event.preventDefault()
    copyValue(this.previousElementSibling)
  })

  $('#btn-show-more').on('click', function (e) {
    e.preventDefault()
    e.target.nextElementSibling.classList.toggle('hidden')
    return false
  })

  setImmediate(function (_f) {
    _f[ctx._fullEdit ? 'resource_title' : 'resource_type_group_id'].focus()
  }, form)

  if (ctx.resource_type === 'Alliances') {
    getById('label-script').classList.remove('required')
  }
}

/**
 * Verifica si hay un script_storyboard en las propiedades adicionales.
 * Si existe le pone el tipo "url"
 */
function checkStoryboard() {
  $('#ap_script_storyboard').attr('type', 'url')
}

/**
 * Obtiene y agrega al contexto los catalogos dinamicos cuando se
 * crea/edita una requisición que no vienen de autoría
 * @param {Object} ctx contexto.
 * @param {Promise} [promise] -
 * @returns {Object} El contexto con los catalogos dinamicos.
 */
function appendDynamicCatalogs(ctx, promise = null) {
  return App.server('/dynamicCatalogs')
  .then(
    res => {
      ctx._catalogs = res
      if (promise) return promise
      return ctx
    },
    xhr => {
      return new Error(App.server.errStr(xhr))
    }
  )
}

function enableSetKRBRelations(ctx) {
  const actions = ['changeres', 'assign']

  actions.forEach(action => {
    action = 'action-' + action
    const $itemr = $('#rb-relations').find('.-' + action)
    if (!$itemr.hasClass('disabled')) { $itemr.click(ctx, require('./' + action)) }
  })

  $('.wb-close-mini.-action-deassign').click(function () {
    $('[name="krb_resource_id"]').val(null)
    ctx.krb_resource_id = null
    updateRelationRBView(ctx, true, enableSetKRBRelations)
  })

  $('.wb-close-mini.-action-deassingres').click(function () {
    $('[name="reference_resource_id"]').val(null)
    ctx.reference_resource_id = null
    updateRelationRBView(ctx, true, enableSetKRBRelations)
  })
}

module.exports = function createRequisition(el, ctx, promise) {
  function showError(err) {
    if (err instanceof Error) {
      ctx.__errors = true
      App.store.add(EVT.STORE, ctx)
      err = ('' + err).replace(/^Error:\s?/, '')
      App.ui.alert(err.trim(), closeForm)
    }
  }

  promise.then(
    // res son los datos del recurso en autoría
    (res) => {
      const preprocAuth = require('./models/preproc-auth')
      const view = require('./views/create.pug')

      if (ctx._fromAuth && !ctx.__duplicated && !res.resource) {
        return new Error('Los datos recibidos no son válidos.')
      }
      if (res.status === $_REQ_ST.COMPLETED || res.needs_review) {
        return new Error('La requisición no es editable.')
      }

      ctx = preprocAuth(ctx, res) // preprocAuth resets the status

      App.store.add(EVT.STORE, ctx)

      if (ctx.user_capabilities['change-ask']) {
        delete ctx.user_capabilities['change-ask']
        if (!ctx.user_capabilities.edit) {
          ctx.user_capabilities.edit = true
          ctx._is_change_ask = true
        }
      }

      ctx.processTypesText = {
        none: '(Proceso no especificado)',
        use: 'Usar recurso sin cambios',
        edit: 'Actualizar recurso existente',
        new: 'Nuevo recurso a partir de uno existente'
      }

      ctx._fullEdit = App.catalogs.reqStatusEditable(ctx.status)
      ctx._extraProps = ctx.requisition_properties
      ctx._partials = ''
      // tabidx no puede ponerse en la raiz porque Pug lo pasa por valor,
      // dentro de _state sí se mantiene pues el valor es una referencia.
      ctx._state = { tabidx: 20 }

      if (ctx.production_key == null) {
        require('scripts/read-prod-key')(ctx)
      }

      if (!ctx.id && !ctx._fromAuth) {
        ctx.fromCreateRequisition = true
      }

      const html = view(ctx)
        // si es reprint tenemos que inicializar la página pues la reentrada va a fallar
      if (ctx.__duplicated) {
        const $html = $(html)

        closeForm(true, ctx)
        $(el).append($html).children().not('.bye-auth').addClass('hide')

      } else {
        $(el).html(html)
      }

      checkStoryboard()
      initForm(ctx)

      if (ctx.fromCreateRequisition) {
        ctx.enableSetKRBRelations = enableSetKRBRelations

        updateRelationRBView(ctx, true, enableSetKRBRelations)
      } else {
        updateRelationRBView(ctx)
      }

      return ctx
    },
    (xhr) => {
      return new Error(App.server.errStr(xhr))
    }
  )
  .always(showError)
}

/*
  Tres formas de entrar:

  #/requisicion/:id/crear    - Desde Autoría, hay que llamar a su endpoint
  #/requisicion/nueva        - Desde aquí, extra-reto
  #/requisicion/:id/editar   - Desde aquí, con requisición existente
*/
module.exports.preloader = function (ctx) {
  const _pp = ctx.params
  const action = _pp.action && _pp.action.toLowerCase() || ''
  let _id = action === 'editar' ? _pp.id
          : action === 'crear' ? _pp.id
          : null
  ctx.processTypes = App.catalogs.get('process_types')

  if (_id === null) {
    const newRec = assign({}, require('./models/requisition'))
    return appendDynamicCatalogs(newRec)
  }

  if (!_id) {
    return $.promiseError({
      statusText: 'Se requiere el ID del recurso.'
    })
  }

  if (action !== 'crear') {
    const sto = getStore() // use cached version from details.js if av.

    ctx.noSpinner = !!sto // in original ctx, avoid loader if exists
    if (sto) ctx = sto
    ctx._isPatch = true

    if (sto) {
      if (!sto.resource_translated_id) {
        return appendDynamicCatalogs(ctx)
      }
      return $.promiseOk(sto)
    }
    // Siempre se cargan los catalogos dinamicos cuando no se pasa por
    // el visor de detalles para que esten disponibles si se edita una
    // requisicion creada manualmente
    return appendDynamicCatalogs(ctx, App.server(`/requisitions/${_id}`))
  }

  const pos = _id.lastIndexOf('-')
  if (~pos) {
    if (_id.slice(0, pos) !== App.user.id) {
      closeForm(true, { __noUser: 1 })
      return false
    }
    _id = _id.slice(pos + 1) || '-' // en blanco generará error
  }

  ctx._fromAuth = true
  ctx.resource_translated_id = ~~_id

  //Se asigna el processType cuando existe como parametro de la URL de autoria
  //con los siguentes valores processtype=[use|edit|new]
  if (_pp.processtype) {
    ctx.process_type = Object.values(ctx.processTypes).indexOf(_pp.processtype) + 1
  }

  $(document.body).addClass('-from-auth')

  return App.server(`/requisitions/${_id}/reprint`, 'GET').then(
    (res) => {
      if (res.id) {
        ctx.__duplicated = 1
        return $.promiseOk(res)
      }
      return App.server.fromAuth(_id)
        .then(res => {
          if (res.resource && res.resource.idResourceInt) {
            if (~~res.resource.idResourceType === 10) {
              return new Error('Por el momento no hay soporte para Aplicaciones de KRB')
            }
            // TODO: la api ya no recibe el valor de krb_resource_id enviado desde el front
            // por lo que aquí hay código obsoleto a limpiar
            res.krb_resource_id = ~~res.resource.idResourceInt

            return getResource(res.krb_resource_id)
              .then(({ data }) => {
                if (data[0]) {
                  const resource = data[0]

                  res.krb_resource = resource
                  ctx.krb_resource_title = resource.title
                  ctx.krb_resource_type = resource.resourceType
                  ctx.reference_resource_title = resource.title
                  ctx.reference_resource_type = resource.resourceType
                  ctx.file_origin = resource.fileOrigin

                  return res
                }

                App.ui.toast.error('No fue posible obtener la información de Resource Bank')

                return false
              })
          }
          return res
        })
    }
  )
}
