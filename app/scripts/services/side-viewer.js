/*
  Para slidePanel v0.3.3
  https://github.com/amazingSurge/jquery-slidePanel

  This controller is waiting for 'resource.viewer.update' events

  El orden de los callbacks llamados (puestos con options) por slidePanel son:
  1. beforeShow
  2. onChange
  3. beforeLoad
  4. afterShow
  5. afterLoad
  El div que crea automáticamente tiene clase "slidePanel" + "slidePanel-<posición>"
  (que es right, left, etc) + si el panel está abierto "slidePanel-show".
  El contenido lo coloca dentro de un div clase "slidePanel-content".
 */
'use strict'

const EXT_CLASS = /slidePanel-(gray|dark-header)/
const ERROR_BOX = require('./side-viewer.html.pug')

/*
  Defaults para slidePanel
*/
$.slidePanel.setDefaults({
  direction: 'right',
  duration: 300,
  closeSelector: '.slidePanel-close',
  mouseDragHandler: '.slidePanel-handler',
  dragTolerance: 80,
  contentError: $.noop,
  loading: {
    template(options) {
      return `<div class="${options.classes.loading}"><div class="loader loader-default"></div></div>`
    }
  },
  // Custom template that adds scrollable wrapper
  template(options) {
    return `<div id="slideViewer" class="slidePanel slidePanel-${
      options.direction}"><div class="slidePanel-scrollable"><div><div class="${
      options.classes.content}"></div></div></div><div class="slidePanel-handler"></div></div>`
  }
})

// for the global click that hides the slidePanel
$.slidePanel.closeView = closeView

function closeView() {
  if ($(document.documentElement).hasClass('slidePanel-html')) {
    $.slidePanel.hide()
  }
}

// SlidePanel.trigger simplificado
function _trigger(view, event, instance) {
  // event
  $(document).trigger('slidePanel::' + event, [view, instance])

  if ($.isFunction(view.options[event])) {
    view.options[event].call(view, instance)
  }
}

function setContent(content) {
  const instance = this._instance
  content = instance.options.contentFilter.call(this, content, instance)

  this.$content.finish().html(content).fadeIn(200)
  _trigger(this, 'afterLoad', instance)
}

function setError(jqXHR) {
  const instance = this._instance
  const content = instance.options.contentError.call(this, jqXHR, instance) || 'Error'

  this.$content.finish().html(content).fadeIn(200)
  _trigger(this, 'ajaxError', jqXHR)
}

// Reemplaza el método load de la vista (View) de slidePanel para permitir
// el fadeOut del contenido y la detección de errores de Ajax
function _load(object) {

  _trigger(this, 'beforeLoad', object)
  this._instance = object

  if (object.url) {
    $.ajax(object.url, assign(object.settings, { context: this }))
      .done(setContent)
      .fail(setError)
      .always(this.hideLoading)
    this.$content.fadeOut()
    this.showLoading()

  } else {
    this.$content.fadeOut(200, () => { setContent.call(this, object.content || '') })
  }
}

/*
 * Events
 */
function beforeLoad() {
  if (this.$content.length) {
    this.$content.off()
      .find('.dropzone').each(function () {
        if (this.dropzone) this.dropzone.destroy()
      })
  }
}

function afterLoad(instance) {
  const cb = instance._cb
  delete instance._cb

  this.$panel.removeClassEx(EXT_CLASS)

  if (cb) cb.call(this, $.slidePanel.k_data)

  // aquí, después del callback del usuario
  App.trigger('slide-view-change', $.slidePanel.k_data)

  // initialize the scroller
  const $scrollable = this.$panel.children('.slidePanel-scrollable')
  $scrollable.asScrollable(
    $scrollable.hasClass('scrollable') ? 'update' : {
      namespace: 'scrollable',
      contentSelector: '>',
      containerSelector: '>'
    })
}

function beforeShow() {
  this.load = _load
  // the ROUTE_EXIT event is emitted by the router after changing pages,
  // so it is a good time to close our viewer.
  App.off(App.EVT.ROUTE_EXIT, closeView)
     .one(App.EVT.ROUTE_EXIT, closeView)
}

function afterHide() {
  if (this.$content.length) {
    this.$content.off()
        .find('.dropzone').each(function () {
          if (this.dropzone) this.dropzone.destroy()
        })
  }
  delete $.slidePanel.k_data
  this.$panel.removeClassEx(EXT_CLASS).find('[class*="-Viewer"]').remove()
  App.trigger('slide-view-change', null)
}

function contentError(xhr) {
  const json = xhr.responseJSON
  let msg
  if (json && json.error && json.message) {
    msg = typeof json.message == 'string' ? json.message : json.message.join('<br>')
    msg = `<h4>${json.error}</h4><p>${msg}</p>`
  } else {
    msg = App.server.errStr(xhr)
    msg = msg === 'error' ? '<p>Error desconocido.</p>' : `<p>${msg}</p>`
  }
  return ERROR_BOX.replace('{msg}', msg)
}

// Render the template Viewer
function contentFilter(res, instance) {
  const data = Array.isArray(res) ? res.slice(0) : typeof res == 'object' ? assign({}, res) : res
  const tmpl = instance._tmpl
  delete instance._tmpl

  $.slidePanel.k_data = data
  return typeof tmpl == 'function' ? tmpl.call(this, data) : data
}


module.exports = function sideViewer(url, tmpl, cb, opts) {

  const options = assign({
    beforeShow,
    contentFilter,
    contentError,
    beforeLoad,
    afterLoad,
    afterHide
  }, opts)

  if (url) {

    if (typeof tmpl == 'string') tmpl = require(tmpl)

    if (url.slice(0, 4) !== 'http') {
      if (url[0] === '/') url = url.slice(1)
      url = `${App.config.API_BASE}/${url}`
    }

    $.slidePanel({
      url,
      dataType: 'json',
      _tmpl: tmpl,
      _cb: cb
    }, options)

  } else {

    const content = options.data
    delete options.data

    $.slidePanel({
      content,
      _tmpl: tmpl,
      _cb: cb
    }, options)

  }
}
