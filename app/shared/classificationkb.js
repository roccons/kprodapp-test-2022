/**
 * Procesamiento de classificationkb
 */
const createModal = require('scripts/create-modal')
const encode = require('scripts/encode')
const classificationTmpl = require('./classificationkb.pug')

const closeForm = () => {
  $('#classif-editor').modal('close')
}

const _selectedOption = opts => {
  const idx = opts ? opts.selectedIndex : -1
  return idx > -1 && opts[idx].value || ''
}

const _doSave = evt => {
  const btn = evt.currentTarget
  const form = btn.form
  const hasData = _selectedOption(form.axis) || _selectedOption(form.theme) || _selectedOption(form.area)
  if (hasData) {
    App.ui.confirm('Guardar los cambios sin agregar la clasificación actual?', () => {
      form._save(form._data, closeForm)
    })
  } else if (form._isRequisition) {
    form._save(form._data)
    closeForm()
  } else {
    form._save(form._data, closeForm)
  }
}

const _removeOpts = select => {
  // Elimina las opciones existentes
  while (select.lastChild) {
    select.removeChild(select.lastChild)
  }
}

const _checkAddBtn = form => {
  const enable = !!_selectedOption(form.grade) && !!_selectedOption(form.area)
  $('#classif-btn-add').attr('disabled', !enable)
}

const _getValue = (form, value) => {
  let key = _selectedOption(form.grade)
  if (key) {
    let opts
    opts = App.catalogs.get('classification_tree')[key]
    console.log(key, '=', opts)
    if (value[0] === 'G' || !opts) return opts
    key = _selectedOption(form.area)
    opts = opts[key]
    console.log(key, '=', opts)
    if (value[0] === 'K' || !opts) return opts
    key = _selectedOption(form.axis)
    opts = opts[key]
    console.log(key, '=', opts)
    if (value[0] === 'X' || !opts) return opts
    key = _selectedOption(form.theme)
    console.log(key, '=', opts[key])
    return opts[key]
  }
  return undefined
}

const _replaceOpts = (select, branch, dict) => {
  // Limpia el SELECT
  _removeOpts(select)

  // Establece como activa una primer opción en blanco
  select.appendChild(new Option('', ''))
  select.selectedIndex = 0
  select.disabled = false

  // Agrega el resto de las opciones
  const keys = Array.isArray(branch) ? branch : Object.keys(branch)
  keys.forEach(k => {
    if (!dict.hasOwnProperty(k)) return

    const opt = new Option(encode(dict[k]), k)
    select.appendChild(opt)
  })
}

/*
 * Acciones al cambio de la selección
 * @param {*} value -
 * @returns {*}
 */
const _onSelect = (select, dependant) => {
  const seleDep = select.form[dependant]
  const language = select.form._language.toLowerCase()
  const classificationDict = App.catalogs.get(`classification_kb_dictionary_${language}`)

  // obtiene las áreas de este grado
  const value = _selectedOption(select)
  if (value) {
    const opts = _getValue(select.form, value) //App.catalogs.get('classification_tree')[value]
    if (opts) {
      _replaceOpts(seleDep, opts, classificationDict)
      _checkAddBtn(select.form)
      return
    }
  }
  _removeOpts(seleDep)
  seleDep.disabled = true
  seleDep.selectedIndex = -1
  _checkAddBtn(select.form)
}

const _onSelectGrade = evt => {
  _onSelect(evt.target, 'area')
}

const _onSelectArea = evt => {
  _onSelect(evt.target, 'axis')
}

const _onSelectAxis = evt => {
  _onSelect(evt.target, 'theme')
}

const _writeLine = (data, ix) => {
  const language = getById('classif-form')._language.toLowerCase()
  const dict = App.catalogs.get(`classification_kb_dictionary_${language}`)
  const grade = dict[data.grade]
  const knowledgearea = dict[data.knowledgearea]
  const theme = data.theme in dict ? dict[data.theme] : ''
  const axis = data.axis in dict ? dict[data.axis] : ''

  $('#classif-items').append(
    `<div class="row">
      <div class="col-sm-3">
        ${grade}
      </div>
      <div class="col-sm-3">
        ${knowledgearea}
      </div>
      <div class="col-sm-2">
        ${axis}
      </div>
      <div class="col-sm-3">
        ${theme}
      </div>
      <div class="col-sm-1">
        <button data-pos="${ix}" type="button" class="btn btn-pure" title="Eliminar">
          <i class="wb-close-mini"></i>
        </button>
      </div>
    </div>
    `
  )
  return data
}

const _checkSave = form => {
  const data = JSON.stringify(form._data)
  $('#classif-btn-save').attr('disabled', data === form.classificationkb.value)
}

const _checkSame = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const _onAdd = evt => {
  const form = evt.currentTarget.form
  const item = {
    grade: _selectedOption(form.grade),
    knowledgearea: _selectedOption(form.area),
    axis: _selectedOption(form.axis),
    theme: _selectedOption(form.theme),
  }

  // Verifica que la combinación no está aun registrada
  if (form._data.some(_item => _checkSame(item, _item))) {
    App.ui.toast.error('Esa combinación ya está incluída.')
    return
  }

  form._data.push(_writeLine(item, form._data.length))
  _checkSave(form)
  _removeOpts(form.theme)
  _removeOpts(form.axis)
  form.area.selectedIndex = form.axis.selectedIndex = form.theme.selectedIndex = -1
  _checkAddBtn(form)
}

const _onRemove = evt => {
  evt.preventDefault()
  evt.stopPropagation()
  const btn = $(evt.target).closest('button')[0]
  const form = btn.form
  const data = form._data

  // Remueve el elemento
  data.splice(~~btn.dataset.pos, 1)
  form._data = data

  // Escribe todo nuevamente
  $('#classif-items').empty()
  data.forEach(_writeLine)
  _checkSave(form)
}

const _start = (data, saveCb, language, isRequisition) => {
  const form = getById('classif-form')
  form._data = data
  form._save = saveCb
  form._language = language
  form._isRequisition = isRequisition

  $('#classif-btn-save').click(_doSave)
  $('#classif-btn-add').click(_onAdd)
  $('#classif-items').click(_onRemove)
  $(form.grade).change(_onSelectGrade)
  $(form.area).change(_onSelectArea)
  $(form.axis).change(_onSelectAxis)
  $(form).submit(false)

  // agrega las lineas de clasificaCIONES existentes
  form._data.forEach(_writeLine)
}

/**
 * Abre diálogo para clasificar el recurso.
 * @param {*} data - OP
 * @param {Function} saveCb - Función para guardar los cambios
 * @param {Boolean} isRequisition - Determina si el módulo es de requisition
 */
module.exports = function editClassificationKB(data, saveCb, isRequisition = false) {
  const datakb = data.classificationkb || []
  const language = data.language ? data.language : 'ES'

  createModal('classif', classificationTmpl({ data, isRequisition }))
    .on('shown.bs.modal', () => { _start(datakb, saveCb, language, isRequisition) })
    .modal()
}
