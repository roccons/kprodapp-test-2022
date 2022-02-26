/*
   User Login, assume App is initialized.
*/
'use strict'

const userLockTmpl = require('./views/user-lock.pug')
const cycleBackground = require('./cycle-background')
const { closeDialog, clearError, setError, getForm, logout } = require('./utils')

const {
  DLG_ID,
  STATUS_BAR,
  SUBMIT_BTN,
  LOGOUT_BTN,
  LOADER_CLASS,
} = require('./env')

const callError = message => setError({ responseJSON: { message } })

const focusFirst = () => {
  setTimeout(() => {
    const field = getForm().password
    if (field) field.focus()
  }, 200)
}

const checkSubmit = () => {
  const form = getForm()
  const btn = form.querySelector(SUBMIT_BTN)

  if (hasClass(document.body, 'hide-login')) {
    document.body.classList.remove('hide-login')
    focusFirst()
    return
  }

  if (btn) {
    btn.disabled = !form.password.value.trim()
    clearError(btn)
  }
}

const closeForm = ok => {
  if (ok) {
    closeDialog(false)
  } else {
    callError('La respuesta del servidor no es válida, tu sesión no se puede iniciar.')
  }
}

const submitForm = evt => {
  evt.preventDefault()

  const $dlg = $(DLG_ID)
  $dlg.find(STATUS_BAR).find('span').empty()
  $dlg.find(STATUS_BAR).find('.loader').addClass(LOADER_CLASS)
  $dlg.find(SUBMIT_BTN).prop('disabled', true)

  App.user.login(getForm(), closeForm, err => {
    callError(err && err.status === 403 ? 'Contraseña incorrecta' : App.server.errStr(err))
  })
}

/**
 * Se ejecuta después que se muestra el popup.
 * Establece los manejadores de eventos y da el foco al primer campo.
 */
const resetForm = () => {
  const $dlg = $(DLG_ID)

  $dlg.find('form').submit(false)
  $dlg.find(SUBMIT_BTN).click(submitForm)
  $dlg.find(LOGOUT_BTN).click(logout)

  $('#user-login-password').on('input change', checkSubmit)
  focusFirst()
}

/**
 * Para el inicio de sesión, sea regular o de 2 pasos, siempre
 * se requiere que el usuario haya ingresado su nombre y contraseña.
 * `App.user.logged()` verifica eso.
 * Si no hay una sesión iniciada, se ejecutará un diálogo en
 * project://app/modules/users/user-login.js
 */
module.exports = function () {
  $(DLG_ID).off().remove()

  // Imágenes de fondo
  cycleBackground.start()

  // Crea el popup
  const $dlg = $(userLockTmpl()).appendTo(document.body)
  $dlg
    .on('shown.bs.modal', resetForm)
    .modal({ backdrop: 'static', keyboard: false })
    .modal('lock')
}
