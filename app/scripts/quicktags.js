/*
  Historia 0404.01 - Asociar QuickTags

  "Como Administrador o Capturista del Resource Bank, puedo asociar quitar
   QuickTags a uno o varios recursos."
 */
'use strict'

const DLG_ID      = '#qt-batch-editor'
const FORM_ID     = '#qt-batch-form'
const ADDTAGS_ID  = '#qt-batch-add'
const CURTAGS_ID  = '#qt-batch-cur'
const STORE_NAME  = 'quicktags'

let _ptags = {}                     // partial tags
let _dirty = null

function getStore() {
  return App.store.get(STORE_NAME)
}

// Mark the form as dirty, now the "Guardar" button works
//
function setDirty() {
  if (!_dirty && _dirty !== null) {
    _dirty = true
    $(FORM_ID).find('.submit-form').removeAttr('disabled')
  }
}

function firstFocus() {
  setTimeout(function () {
    $(ADDTAGS_ID).tokenfield('getInput').focus()
  }, 50)
}

// Closes the dialog and removes their container from the dom
//
function closeForm() {
  $(DLG_ID).off('hide.bs.modal').modal('hide')
}

function pluralN(name, n) {
  const orders = name === 'orders'
  if (n === 1) return orders ? '1 orden' : '1 requisición'
  return `${n} ${orders ? 'órdenes' : 'requisiciones'}`
}

//---------------------------------------------------------------------------
//  TOKENFIELD EVENTS
//---------------------------------------------------------------------------

// Find and returns the token by name, return null if token does not exists
//
function findToken(value) {
  const tokens = document.querySelectorAll(FORM_ID + ' .token')

  for (let i = 0; i < tokens.length; i++) {
    const $token = $(tokens[i])
    if ($token.data('attrs').value === value) {
      return $token
    }
  }
  return false
}

// Removes the tag from the partials and clear the partial class in the dom
//
function removePartial(tag) {
  const isin = !!_ptags[tag]

  if (isin) {
    const $token = findToken(tag)
    if ($token) {
      $token.removeClass('partial-token')
    }
    delete _ptags[tag]
    setDirty()
  }
  return isin
}

//---------------------------------------------------------------------------
//  DIALOG EVENTS
//---------------------------------------------------------------------------

// adds the current tags as readonly
function setCurTags(tags) {
  const $el = $(CURTAGS_ID)

  $el
    .on('tokenfield:createdtoken', function (e) {
      const tag = e.attrs.value

      if (_ptags[tag]) {
        e.relatedTarget.classList.add('partial-token')
      }
      setDirty(true)
    })
    .on('tokenfield:removedtoken', function (e) {
      const tag = e.attrs.value

      if (_ptags[tag]) {
        delete _ptags[tag]
      }
      setDirty(true)
    })
    .tokenfield({
      allowEditing: false,
      allowPasting: false,
      beautify: false,
      tokens: tags
    })

  // Along with allowEditing/allowPasting false, this is the trick
  // to avoid add tokenfield, but allow delete.
  $el.tokenfield('getInput').prop('readonly', true)
}

// initialize the tokenfield input for new tags
function setAddTags() {

  $(DLG_ID).one('shown.bs.modal', firstFocus)

  $(ADDTAGS_ID)
    .on('tokenfield:createtoken', function (e) {
      const tag = e.attrs.value

      if (!removePartial(tag) && findToken(tag)) {
        e.preventDefault()
        App.ui.toast.info('La etiqueta ya existe, por favor ingresa una nueva.')
      } else {
        setDirty(true)
      }
    })
    .tokenfield()
}

// Initialize the dialog
//
function onShow() {
  const ctx = getStore()
  const oldtags = ctx.groupedTags

  _dirty = null

  const tags = Object.keys(oldtags).sort(sortStr)

  // partial tags ( _ptags[tag_name] = number_of_resources )
  _ptags = {}
  tags.forEach(t => { if (oldtags[t] > 0) _ptags[t] = oldtags[t] })

  setCurTags(tags)

  setAddTags()

  _dirty = false
}

function onCancel(e) {    // eslint-disable-line consistent-return
  if (_dirty) {
    _dirty = null
    e.preventDefault()
    App.ui.yesNo('¿Estás seguro que quieres cancelar los cambios?',
      function () {
        closeForm()
        App.ui.toast.info('La edición se canceló.')
      },
      function () {
        _dirty = true
        firstFocus()
      })
  } else closeForm()
}

//---------------------------------------------------------------------------
//  MAIN
//---------------------------------------------------------------------------

function sortStr(a, b) {
  return a.localeCompare(b)
}

function sendToDB(name, data, cb) {
  const quicktags = []

  data.recs.forEach(rec => {
    const str1 = rec.tags.sort(sortStr).join(',')
    const tags = rec.tags.filter(t => data.remove.indexOf(t) < 0)
    data.add.forEach(t => { if (tags.indexOf(t) < 0) tags.push(t) })
    const str2 = tags.sort(sortStr).join(',')
    if (str1 !== str2) {
      quicktags.push({ id: rec.id, tags: str2 })
    }
  })

  if (!quicktags.length) {
    App.ui.toast.info('Sin cambios.')
    return
  }

  App.server(`${name}/quicktags`, 'POST', { data: { quicktags } })
    .done(() => {
      if (cb) {
        cb(quicktags)
      } else {
        App.refreshTables('quicktags', quicktags)
      }
      App.ui.toast.success('Las quickTags se actualizaron correctamente.')
    })
    .fail(xhr => {
      App.ui.alert(`Error guardando quicktags: ${App.server.errStr(xhr)}`)
    })
}

// Saves the data, only the changed tags
//
function saveForm(evt) {
  const ctx     = getStore()
  const oldtags = ctx.groupedTags

  evt.preventDefault()

  // mark the form with no dirty (pre-edition)
  if (_dirty === null) return
  _dirty = null

  const toAdd = []
  const toDel = []
  let tag

  // get the new (remaining) tags as an object
  const getTokens = require('scripts/tokens-as-array')
  const newtags = {}
  function T(t) { newtags[t] = true }
  getTokens(ADDTAGS_ID).forEach(T)
  getTokens(CURTAGS_ID).forEach(T)

  // delete all from the old tags not in the new tags
  for (tag in oldtags) {
    if (!newtags[tag]) toDel.push(tag)
  }

  // select the new tags not in old tags, but skip the
  // partial tags not affected by the edition
  for (tag in newtags) {
    if (!_ptags[tag] && oldtags[tag] !== -1) toAdd.push(tag)
  }

  // store the result to DB
  const cb = $(FORM_ID).data('_cb')
  const data = { recs: ctx.selectedTags, add: toAdd, remove: toDel }

  closeForm()
  sendToDB(ctx.name, data, cb)
}

// Group the tags by name and set it values to a number having -1 if the
// tag is assocciated to all resources.
function getGroupedTags(rows) {
  const tags = {}

  // group tags by name and get the count of each
  rows.forEach(row => {
    const thisTags = row.tags

    for (let i = 0; i < thisTags.length; i++) {
      const tag = thisTags[i]
      if (tag in tags) tags[tag]++
      else tags[tag] = 1
    }
  })

  // set partial to true if the label is included in all the resources
  const count = rows.length

  for (const tag in tags) {
    if (tags[tag] === count) tags[tag] = -1
  }
  return tags
}

//---------------------------------------------------------------------------
// The main function creates and runs the dialog
//
module.exports = function quicktagsEditor(rows, name, cb) {
  const orders = name === 'orders'

  $.hideTooltips()
  if (!rows.length) {
    App.ui.toast.info(`No hay ${orders ? 'órdenes' : 'requisiciones'} seleccionadas.`)
    return
  }

  const view = require('views/quicktags.html.pug')
  let olen = rows.length

  rows = rows.filter(orders
    ? (e) => e.status !== $_ORDER_ST.READY && e.status !== $_ORDER_ST.PUBLISHED
    : (e) => e.status !== $_REQ_ST.COMPLETED)

  if (rows.length === 0) {
    let msg
    if (name === 'orders') {
      msg = olen > 1 ? 'estas órdenes.' : 'esta orden.'
    } else {
      msg = olen > 1 ? 'estas requisiciones.' : 'esta requisición.'
    }
    App.ui.alert('No puedes editar ' + msg)
    return
  }

  if (rows.length !== olen) {
    olen = olen - rows.length
    App.ui.alert('Se ignorarán ' + pluralN(name, olen) + ' que no puedes editar.')
  }

  // save the ids of the selected resources
  const selectedTags = rows.map(r => {
    return { id: r.id, tags: r.quicktags ? r.quicktags.split(/,\s*/g) : [] }
  })

  // get the tags group by name
  const groupedTags = getGroupedTags(selectedTags)

  const ctx = { name, selectedTags, groupedTags }

  App.store.add(STORE_NAME, ctx)

  $('#main-page').append(view)

  $(DLG_ID)
    .one('show.bs.modal', onShow)
    .on('hidden.bs.modal', $.selfRemove)
    .on('hide.bs.modal', onCancel)
    .modal({
      backdrop: 'static'
    })

  $(FORM_ID)
    .submit(false)
    .data('_cb', cb)
    .find('.submit-form').click(saveForm)
}
