const cycleBackground = require('./cycle-background')
const {
  DLG_ID,
  STATUS_BAR,
  SUBMIT_BTN,
  // LOGOUT_BTN,
  LOADER_CLASS,
} = require('./env')

exports.getForm = () => document.getElementById('user-login-form')

const _setError = (text, disab) => {
  const $dlg = $(DLG_ID)

  $dlg.find('.loader').removeClass(LOADER_CLASS)
  $dlg.find(STATUS_BAR).addClass('haserror').find('span').html(text)
  $dlg.find(SUBMIT_BTN).prop('disabled', !!disab).prop('haserror', true)

  const ff = getById('user-login-username') ||
    getById('user-login-password') || getById('user-login-code')
  if (ff) {
    ff.select()
    ff.focus()
  }
}

exports.setError = xhr => {
  if (!xhr) xhr = {}
  const json = xhr.responseJSON || {}

  if (xhr.status === 403 || xhr.status === 404) {
    _setError(json.message || 'Nombre de usuario o contraseña incorrecta.', true)
  } else {
    App.error(`Error en ${this.type}\nURL: ${this.url}\nDatos: ${JSON.stringify(json || xhr)}`)
    _setError(json.message ||
      'Error del servicio de autenticación de usuarios,<br>por favor reintenta más tarde.')
  }
}

/**
 * Cierra el popup del login y opcionalmente ejecuta la app
 * @param {boolean} [runApp=true] Ejecutar App.run?
 */
exports.closeDialog = runApp => {
  const $body = $(document.body)
  const $dlg  = $(DLG_ID)

  const destroy = () => {
    $dlg.off().empty()

    setImmediate(() => {
      $dlg.remove()
      $body.removeClass('login')
    })
  }

  $dlg
    .off()
    .one('hidden.bs.modal', destroy)
    .modal('close')

  if (runApp !== false) {
    App.run()
  }
  cycleBackground.stop()
}

exports.clearError = btn => {
  if (btn.haserror) {
    btn.haserror = false

    $(btn.form).find(STATUS_BAR).find('span').empty()
  }
}

exports.logout = evt => {
  evt.preventDefault()
  evt.stopPropagation()
  if (evt.stopImmediatePropagation) evt.stopImmediatePropagation()
  App.user.logout(true)
}
