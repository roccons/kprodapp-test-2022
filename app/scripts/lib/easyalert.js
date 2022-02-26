/*
  Usage:
  alert('message', type, options, function () {})
*/
'use strict'

//#if 1
//#set _TRANSITION_DURATION = 300
//#set _FIRST_TABIDX = 56789
//#set _DLG_ZINDEX = 1801
//#else
const $_TRANSITION_DURATION = 300
const $_FIRST_TABIDX = 56789
const $_DLG_ZINDEX = 1801
//#endif
//#if 0
const $_DLG = require('values')._DLG
//#endif

let _idx = 0

function _getRoot(el) {
  while (el && !el.classList.contains('easyalert')) {
    el = el.parentNode
  }
  return el
}

function _isFunction(v) {
  return !!v && typeof v == 'function'
}

function _stopEvent(e) {
  e.preventDefault()
  e.stopPropagation()
}


// EasyAlert

const _ea2 = Object.create(null)


Object.defineProperties(_ea2, {
  OK:     { enumerable: true, value: $_DLG.OK },
  YES:    { enumerable: true, value: $_DLG.YES },
  NO:     { enumerable: true, value: $_DLG.NO },
  CANCEL: { enumerable: true, value: $_DLG.CANCEL },
  IGNORE: { enumerable: true, value: $_DLG.IGNORE },
  ABORT:  { enumerable: true, value: $_DLG.ABORT },
  CLOSE:  { enumerable: true, value: $_DLG.CLOSE }
})


function checkFocus() {
  const root = _getRoot(this)

  if (root && !root.classList.contains('ea-hide')) {
    const dlgEl = root.querySelector('.dialog')

    setImmediate(function (dialog) {
      let e = document.activeElement

      if (!e || !dialog.contains(e)) {
        e = dialog.querySelector('[tabindex]') || dialog
        e.focus()
      }
    }, dlgEl)
  }
}

function giveFocus(dlg, def) {
  const list  = dlg.querySelectorAll('form,input,textarea,select,button')
  let tabidx  = $_FIRST_TABIDX
  let focus
  let ctrl

  if (def) def = '' + ~~def
  else focus = dlg.querySelector('.btn-ok')

  dlg.setAttribute('tabindex', ++tabidx)
  dlg.addEventListener('blur', checkFocus)

  for (let i = 0; i < list.length; i++) {
    ctrl = list[i]
    ctrl.setAttribute('tabindex', ++tabidx)
    ctrl.addEventListener('blur', checkFocus)
    if (def && !ctrl.disabled && ctrl.getAttribute('data-id') === def) {
      focus = ctrl
    }
  }

  ctrl = focus || dlg
  ctrl.focus()
  if (ctrl.nodeName === 'INPUT') ctrl.select()
}

function closeDialog(dlg, cb) {
  let root = dlg && dlg.rootElement
  if (!root) {
    if (cb) cb()
    return
  }

  const removeThis = function () {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root)
      root = dlg.rootElement = null
      if (_isFunction(cb)) cb()
    }
  }

  dlg.shown = false
  root.classList.add('ea-hide')
  root.addEventListener('transitionend', removeThis)

  setTimeout(removeThis, $_TRANSITION_DURATION) // if no transitions
}

function callCloseThis(cb) {
  closeDialog(this, cb)
  return this
}

function allowClose(allow) {
  allow = allow !== false
  this.closeOnEsc = allow

  if (this.rootElement) {
    const buttons = this.rootElement.querySelectorAll('button')

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = !allow
    }

    this.rootElement.classList.toggle('waitstate', !allow)
  }
  return this
}

/**
 * Changes the wait state.
 * @param {string} message  - No default, use allowClose if you have no message
 * @param {Array} buttons   - Default to the OK button
 * @param {boolean} wait    - Default to `true`, send `false` to allow close.
 * @returns {Object} `this`
 */
function waitState(message, buttons, wait) {
  if (typeof buttons == 'boolean') {
    wait = buttons
    buttons = 0
  }
  if (!buttons && buttons !== null) {
    buttons = App.ui.CLOSE
  }

  this.setMessage(message)
  this.setButtons(buttons)
  this.allowClose(wait === false)   // aquí, para que encuentre los botones en su lugar

  return this
}

function callCloseDialog(_dlg, btn) {
  _dlg = _dlg || {}

  const func = btn === $_DLG.OK || btn === $_DLG.YES ? _dlg.cbYes : _dlg.cbNo
  var close = true // eslint-disable-line no-var

  if (func) {
    try {
      close = func.call(_dlg, btn) !== false
    } catch (e) {
      console.error(e)
    } finally {
      if (close) {
        closeDialog(_dlg)
      }
    }
  } else {
    closeDialog(_dlg)
  }
}

function clickHandler(ev) {
  const root = ev.currentTarget
  const el   = ev.target

  if (el.nodeName === 'BUTTON') {
    const idn = ~~el.getAttribute('data-id')

    callCloseDialog(root._dialog, idn)

  } else if (el === root) {
    checkFocus.call(el.querySelector('dialog'))
  }
}

function escHandler(ev) {
  if ((ev.which || ev.keyCode) === 27) {
    const root = ev.currentTarget

    ev.preventDefault()
    ev.stopPropagation()
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation()

    if (root._dialog.closeOnEsc) {
      // esc closes, but run the callback
      callCloseDialog(root._dialog)
    }
  }
}


function setMessage(msg) {
  const msgbox = this.rootElement && this.rootElement.querySelector('.msg')

  if (msgbox) {
    msgbox.innerHTML = msg
    msgbox.normalize()  // reflow
  }
  return this
}


function setButtons(list, _int) {
  const btns = []
  const tmpl = _ea2.tmpl

  if (list) {
    if (!Array.isArray(list)) list = [list]

    for (let ix = 0; ix < list.length; ix++) {
      const ids = list[ix]
      const btn = typeof ids == 'number' ? _ea2.buttons[ids] : ids

      if (btn) {
        btns.push((btn.default ? tmpl.btndef : tmpl.button)
            .replace('{id}', btn.id)
            .replace('{caption}', btn.caption))
      }
    }
  }

  if (_int === true) {
    return btns.join('')
  }

  if (this.rootElement) {
    this.rootElement.querySelector('nav').innerHTML = btns.join('')
  }
  return this
}


/**
 * Alertify2 private object
 * @type {Object}
 */
assign(_ea2, {

  version: '1.0.8',

  tmpl: {
    main:   '<div class="dialog" role="dialog">' +
              '<form class="content">' +
                '<div class="body">' +
                  '<div class="msg">{message}</div>' +
                  '<div class="input">{input}</div>' +
                '</div>' +
                '<footer class="footer"><nav>{buttons}</nav></footer>' +
              '</form>' +
            '</div>',
    button: '<button type="button" class="btn btn-default btn-no" data-id="{id}">{caption}</button>',
    btndef: '<button type="submit" class="btn btn-primary btn-ok" data-id="{id}">{caption}</button>',
    class3: 'form-control',
    input:  '<div class="form-material"><input type="{type}" class="{class}"{extras}></div>'
  },

  buttons: [
    null,
    { id: $_DLG.OK,     caption: 'Aceptar', default: true },
    { id: $_DLG.YES,    caption: 'Sí',      default: true },
    { id: $_DLG.NO,     caption: 'No' },
    { id: $_DLG.CANCEL, caption: 'Cancelar' },
    { id: $_DLG.IGNORE, caption: 'Ignorar' },
    { id: $_DLG.ABORT,  caption: 'Anular' },
    { id: $_DLG.CLOSE,  caption: 'Cerrar' }
  ],

  /**
   * Builds the proper message box.
   *
   * @param   {Object} item - Current object in the queue
   * @returns {String} An HTML string of the message box.
   */
  _build(item) {
    const tmpl = _ea2.tmpl
    const btns = setButtons(item.buttons, true)

    return tmpl.main
      .replace('{message}', item.message)
      .replace('{buttons}', btns)
      .replace('{input}', item.input || '')
  },

  /**
   * Initiate all the required pieces for the dialog box
   *
   * @param   {Object} item - Dialog descriptor
   * @returns {Object} promise
   */
  _setup(item) {
    const root = document.createElement('div')

    ++_idx
    root.setAttribute('id', `easyalert_${_idx}`)
    root.style.zIndex = $_DLG_ZINDEX + _idx
    root.setAttribute('tabindex', '-1')
    root.className = 'easyalert ea-hide'
    root.innerHTML = this._build(item)

    root.addEventListener('click', clickHandler, false)
    root.addEventListener('keydown', escHandler, true)

    if (item.extra) {
      root.querySelector('.dialog').classList.add('extra')
    }

    root._dialog = {
      rootElement: root,
      shown: false,
      close: callCloseThis,
      setMessage,
      setButtons,
      allowClose,
      waitState,
      defaultBtn: item.defaultBtn,
      closeOnEsc: item.closeOnEsc,
      cbYes: item.cbYes,
      cbNo: item.cbNo
    }

    document.body.appendChild(root)

    setImmediate(_dlg => {
      const root   = _dlg.rootElement
      const dialog = root.querySelector('.dialog')
      const form   = root.querySelector('form')

      if (form) form.addEventListener('submit', _stopEvent, true)

      _dlg.shown = true
      root.classList.remove('ea-hide')
      giveFocus(dialog, _dlg.defaultBtn)

      if (item.allowClose) {
        _dlg.allowClose(false)
      }

    }, root._dialog)

    return root._dialog
  },

  /**
   * Create a dialog box
   *
   * @param   {String}   message - The message passed from the callee
   * @param   {Object}   [info]  - Info of the dialog to create
   * @param   {Function} [cbYes] - Callback function when YES button is clicked.
   * @param   {Function} [cbNo]  - Callback function when NO button is clicked.
   * @param   {Array}    [btns]  - Array con IDs de botones a mostrar
   * @returns {Object}
   */
  dialog(message, info, cbYes, cbNo, btns) {

    if (_isFunction(info)) {
      cbNo  = cbYes
      cbYes = info
      info  = {}
    } else if (!info) {
      info  = {}
    }

    if (!_isFunction(cbYes)) cbYes = null
    if (!_isFunction(cbNo))  cbNo  = null

    let buttons = btns || info.buttons
    if (buttons !== null) {
      if (!buttons) buttons = $_DLG.OK
    }

    return _ea2._setup({
      message,
      input: info.input || '',
      buttons,
      closeOnEsc: info.closeOnEsc !== false,
      allowClose: info.allowClose === false || info.waitState === true,
      extra: info.extra,
      cbYes,
      cbNo,
      defaultBtn: info.defaultBtn
    })
  },

  alert(message, opts, cbYes, cbNo) {
    return _ea2.dialog(message, opts, cbYes, cbNo)
  },

  confirm(message, opts, cbYes, cbNo) {
    return _ea2.dialog(message,
          opts, cbYes, cbNo, [$_DLG.CANCEL, $_DLG.OK])
  },

  yesNo(message, opts, cbYes, cbNo) {
    return _ea2.dialog(message,
          opts, cbYes, cbNo, [$_DLG.NO, $_DLG.YES])
  },

  yesNoCanc(message, opts, cbYes, cbNo) {
    return _ea2.dialog(message,
          opts, cbYes, cbNo, [$_DLG.CANCEL, $_DLG.NO, $_DLG.YES])
  },

  prompt(message, input, cbYes, cbNo) {
    return _ea2.dialog(message, {
      buttons: [$_DLG.CANCEL, $_DLG.OK],
      input,
    }, cbYes, cbNo)
  },

  closeLast() {
    let elem = document.body.lastElementChild

    while (elem) {
      if (elem.classList.contains('easyalert')) {
        const _dlg = elem._dialog
        if (_dlg) {
          _dlg.close()
          break
        }
      }
      elem = elem.previousElementSibling
    }
  },

})


module.exports = _ea2
