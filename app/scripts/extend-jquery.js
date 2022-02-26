'use strict'

// helpers para crear "Deferreds" de jQuery resueltos o rechazados.

$.promiseOk = function (value) {
  // eslint-disable-next-line new-cap
  return $.Deferred().resolve(value).promise()
}

$.promiseError = function (value) {
  // eslint-disable-next-line new-cap
  return $.Deferred().reject(value).promise()
}

$.hideTooltips = function () {
  // oculta también las notificaciones
  const $notif = $('#user-notifications')

  if ($notif.hasClass('open')) {
    $notif.find('[data-toggle="dropdown"]').click()
  }
  $('[data-original-title]').tooltip('hide')
}

$.selfRemove = function () {
  const $this = $(this).stop(true, true)
  setTimeout(() => { $this.off().empty().remove() }, 20)
  return $this
}


/*
  Dropzone aquí para ser usado por script/services/user.js
*/
$.Dropzone = require('scripts/lib/dropzone')


/*
  Plugin para cambiar dinámicamente la altura de los textarea
*/
require('./lib/auto-height')

/*
  Load the jQuery.onlyDigits plugin
*/
require('./lib/onlyDigits')

/*
  Loads Sortable jQuery plugin ($.sortable)
  https://github.com/RubaXa/Sortable
*/
require('./lib/jquery-sortable')


/*
  Bootstrap Dialog MOD to avoid close at run-time.
*/
$.extend($.fn.modal.Constructor.prototype, {
  // unconditional close
  close(fast) {
    if (fast === 'fast' && this.$element) {
      this.$element.removeClass('fade').stop(true, true)
    }
    if (this.isShown) {
      if (this._isLock) this.unlock()
      this.hide()
    }
  },
  // locks the dialog so that it cannot be hidden
  lock() {
    if (!this._isLock) {
      this._isLock = true
      this._bsHide = this.hasOwnProperty('hide') ? this.hide : null
      this._bsToggle = this.hasOwnProperty('toggle') ? this.toggle : null
      this.hide = this._customHide
      this.toggle = this._customHide
      this.$element.find('[data-dismiss="modal"]')
        .attr('data-dismiss', 'locked').on('click', this._customHide)
    }
  },
  // unlocks the dialog so that it can be hidden by 'esc' or clicking on the backdrop (if not static)
  unlock() {
    if (this._isLock) {
      this._isLock = false
      delete this.hide
      delete this.toggle
      if (this._bsHide != null) this.hide = this._bsHide
      if (this._bsToggle != null) this.toggle = this._bsToggle
      this.$element.find('[data-dismiss="locked"]')
        .attr('data-dismiss', 'modal').off('click', this._customHide)
    }
  },
  // prevent hide if locked
  _customHide(e) {
    if (e) e.preventDefault()
    App.ui.toast.info('Espera por favor.')
  }
})


/**
 *  $().removeClassEx
 *
 * @param   {RegExp} re Regex with the pattern to remove
 * @returns {Array} the same jQuery elements
 * @extends jQuery
 */
$.fn.removeClassEx = function (re) {
  return this.each(function () {
    const classes = this.classList
    const len = classes.length
    let i = len
    while (--i >= 0) {
      if (re.test(classes[i])) classes.remove(classes[i])
    }
  })
}
