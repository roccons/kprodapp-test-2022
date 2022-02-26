/*
   User Login, assume App is initialized.
*/
'use strict'

const user = require('scripts/services/user')
const userLoginTmpl = require('./views/user-login.pug')
const cycleBackground = require('./cycle-background')
const checkLogin = require('./check-login')
const { clearError, setError, getForm } = require('./utils')

const {
  DLG_ID,
  STATUS_BAR,
  SUBMIT_BTN,
  LOADER_CLASS,
} = require('./env')

const callError = message => setError({ responseJSON: { message } })

const checkSubmit = () => {
  const form = getForm()
  const btn = form.querySelector(SUBMIT_BTN)

  if (btn) {
    btn.disabled = !(form.username.value.trim() && form.password.value.trim())
    clearError(btn)
  }
}

const saveForm = ok => {
  if (ok) {
    checkLogin()
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

  user.login(getForm(), saveForm, err => {
    callError(err && err.status === 403
      ? 'Nombre de usuario o contraseña incorrecta.' : App.server.errStr(err))
  })
}

const resetForm = () => {
  const $dlg = $(DLG_ID)

  $dlg.find('form').submit(false)
  $dlg.find(SUBMIT_BTN).click(submitForm)

  $('#user-login-username,#user-login-password').on('input change', checkSubmit)

  setTimeout(() => {
    const field = getForm().username
    if (field) field.focus()
  }, 200)
}

/**
 * Crea el diálogo de inicio de sesión
 */
const firstLogin = () => {
  $(DLG_ID).off().remove()

  // Inicia el cargador de imágenes de fondo
  cycleBackground.start()

  // Crea el popup
  const $dlg = $(userLoginTmpl()).appendTo(document.body)

  $dlg
    .on('shown.bs.modal', resetForm)
    .modal({ backdrop: 'static', lock: true })
    .modal('lock')
}

/**
 * Para el inicio de sesión, sea regular o de 2 pasos, siempre
 * se requiere que el usuario haya ingresado su nombre y contraseña.
 * `App.user.logged()` verifica eso.
 * Si no hay una sesión iniciada, se ejecutará un diálogo en
 * project://app/modules/users/user-login.js
 */
module.exports = function () {
  /*
    Si no hay usuario en sesión, se llama directamente a `remoteRun`,
    de otra manera se ejecuta como callback de `user-login`.
    `remoteRun` a su vez esperará la resolución de la carga de los
    catálogos antes de ejecutar `run()`.
  */
  if (App.user.logged()) {
    checkLogin()
  } else {
    firstLogin()
  }
}
