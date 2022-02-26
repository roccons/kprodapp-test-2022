/* global ClientJS */
require('clientjs')

const loginCodeTmpl = require('./views/login-code.pug')
const cycleBackground = require('./cycle-background')
const { clearError, closeDialog, getForm, setError, logout } = require('./utils')

const {
  DLG_ID,
  LOADER_CLASS,
  LOGOUT_BTN,
  STATUS_BAR,
  SUBMIT_BTN,
} = require('./env')

const APP_NAME = 'Workflow'
const CODE_INPUT_ID = 'user-login-code'

/**
 * Se usa si el navegador no soporta `Geolocation`
 */
const fakeGeo = {
  getCurrentPosition(fn) {
    fn({ coords: { latitude: 0, longitude: 0 } })
  }
}

/**
 * Formatea el mensaje de error generado y lo muestra con setError.
 * @param {*} xhr Usualmente objeto jqXHR
 */
const handleError = xhr => {
  const message = App.server.errStr(xhr)
  setError({ responseJSON: { message } })
}

/**
 * Llama a un endpoint de la API y devuelve una `Promise`.
 * @param {string} uri Endpoint a llamar
 * @param {object} data Datos para el endpoint
 * @returns {Promise<*>}
 */
const callApi = (uri, data) =>
  App.server(`${App.config.API_BASE}/2fa/${uri}`, 'POST', { data })

/**
 * Cierra el diálogo si hay éxito, o muestra el mensaje de error.
 * @param {*} data Datos para el endpoint `validate`
 */
const doLogin = data => {
  callApi('validate', data)
    .done(closeDialog)
    .fail(handleError)
}

/**
 * Completa el inicio de sesión
 */
const saveForm = () => {
  const client = new ClientJS()
  const data = {
    idUser: App.user.id,
    code: getById(CODE_INPUT_ID).value.replace(/\D+/g, ''),
    userDevice: {
      id: App.config.ls('idDevice'),
      app: APP_NAME,
      userDeviceDetail: {
        ip: '187.189.40.146',
        browser: client.getBrowser(), // 'Chrome',
        browserVersion: client.getBrowserVersion(), // '80.0.3987.163',
        osVersion: client.getOSVersion(), // '10.14.3',
        os: client.getOS(), // 'Mac OS',
        latitude: 0,
        longitude: 0,
      },
    },
  }

  // Obtiene la ubicación del usuario
  const Geolocation = window.navigator.geolocation || fakeGeo
  Geolocation.getCurrentPosition(
    info => {
      Object.assign(data.userDevice.userDeviceDetail, {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      })
      doLogin(data)
    },
    err => {
      console.log(err)
      doLogin(data)
    },
    {
      maximumAge: 1000 * 86400 * 15, // ubicación de hasta 15 días atrás
      timeout: 1000 * 20, // intentar leerla hasta por 20 segundos
    }
  )
}

/**
 * Envía el formulario
 * @param {*} evt Evento jQuery
 */
const submitForm = evt => {
  evt.preventDefault()

  const $dlg = $(DLG_ID)
  $dlg.find(STATUS_BAR).find('span').empty()
  $dlg.find(STATUS_BAR).find('.loader').addClass(LOADER_CLASS)
  $dlg.find(SUBMIT_BTN).prop('disabled', true)

  saveForm()
}

/**
 * Habilita el botón si hay un código capturado.
 * @param {*} evt Evento jQuery
 */
const checkSubmit = () => {
  const btn = getForm().querySelector(SUBMIT_BTN)

  if (btn) {
    const field = getById(CODE_INPUT_ID)
    const value = field.value.replace(/\D+/g, '')

    if (field.value !== value) {
      field.value = value
    }
    btn.disabled = value.length !== 6
    clearError(btn)
  }
}

/**
 * Establece los controladores del popup y da el foco al primer campo.
 * @param {*} evt -
 */
const resetForm = () => {
  const $dlg = $(DLG_ID)

  $dlg.find('form').submit(false)
  $dlg.find(SUBMIT_BTN).click(submitForm)
  $dlg.find(LOGOUT_BTN).click(logout)

  $(`#${CODE_INPUT_ID}`).onlyDigits().on('input keypress change', checkSubmit)

  setTimeout(() => {
    const input = getById(CODE_INPUT_ID)
    if (input) input.focus()
  }, 200)
}

/**
 * Muestra el diálogo para inicializar la App de celular y capturar el código.
 * @param {*} [qr] Objeto devuelto por el endpoint `generate-qrurl`
 */
const showForm = qr => {
  const html = loginCodeTmpl(qr)

  cycleBackground.start()

  // Crea el popup si aun no existe
  let $dlg = $(DLG_ID)

  if ($dlg.length) {
    const part = $(html).find('.modal-content')
    $dlg.off().find('.modal-content').replaceWith(part)
    setImmediate(resetForm)
  } else {
    $dlg = $(html)
      .appendTo(document.body)
      .on('shown.bs.modal', resetForm)
      .modal({ backdrop: 'static', keyboard: false })
  }

  $dlg.modal('lock')
}

/**
 * El usuario está logeado, es decir tenemos un ID de sesión
 * @returns {{ idUser: string, idDevice: number }}
 */
module.exports = function () {
  /*
    Pide el status del usuario que tendrá las siguientes props, entre otras:
    need2fa : falsy si no se usa TOTP
    generateQR : true si hay que mostrar QR para descargar la App de ceclular
    validateCode : true si se requiere entrar un nuevo código TOTP
  */
  const idDevice = new ClientJS().getFingerprint()
  const data = {
    appName: APP_NAME,
    idUser: App.user.id,
    idDevice,
  }

  // Guarda el idDevice para futuras referencias
  App.config.ls.set('idDevice', idDevice)

  // Obtiene el status del usuario en sesión
  return callApi('user/status', data)
    .done(res => {
      if (res.need2fa) {
        if (res.generateQR) {
          callApi('generate-qrurl', data)
            .done(showForm)
            .fail(handleError)
          return
        }
        if (res.validateCode) {
          showForm({})
          return
        }
      }
      closeDialog()
    })
    .fail(handleError)
}
