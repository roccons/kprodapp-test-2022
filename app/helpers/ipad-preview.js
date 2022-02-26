'use strict'

const BACKDROP_ID = 'ipad-backdrop'

const BACKDROP = '#ipad-backdrop'
const PREVIEW  = '#ipad-preview'
const CONTROLS = '#ipad-controls'


function checkKey(evt) {
  if ((evt.keyCode || evt.which) === 27) {
    evt.preventDefault()
    evt.stopPropagation()
    $(BACKDROP).click()
  }
}


function doShow() {
  $(PREVIEW).keydown(checkKey)[0].focus()

  setTimeout(() => {
    $(PREVIEW).on('blur', function (e) {
      if (!this._hide) {
        e.preventDefault()
        setTimeout(p => { p.focus() }, 0, this)
      }
    })
  }, 200)
}


function hideBox(evt) {
  const ctl = evt.target
  let skip = false

  if (hasClass(ctl, 'ipad-close') || ctl.id === BACKDROP_ID) {
    skip = true
    getById(PREVIEW)._hide = 1
    $(BACKDROP).fadeOut('fast', function () {
      $(this).remove()
    })

  } else if (hasClass(ctl, 'ipad-skin')) {
    $(PREVIEW).toggleClass('-dark-skin')
  }

  if (skip) evt.preventDefault()
  return skip
}


module.exports = function ipadPreview(fname) {
  const preview = require('scripts/create-preview')
  const view = require('./ipad-preview.pug')
  const html = preview(fname, true)

  if (/^<(i|span|div)\b/.test(html) && html.indexOf('dz-frame') < 0) {
    App.ui.toast.info('Vista previa no disponible.')
    return
  }

  if (getById(BACKDROP_ID)) {
    $(BACKDROP).finish().remove()
  }

  $(document.body).append(view({ content: html }))

  $(BACKDROP).click(hideBox)
  $(CONTROLS).click(hideBox)

  setImmediate(doShow)
}
