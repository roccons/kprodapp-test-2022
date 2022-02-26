'use strict'

const APPJSON = 'application/json; charset=UTF-8'
const MAX_LEN = 512

let err401 = 0

function logOut(force) {
  if (err401 === 0 || force === 1) {
    ++err401
    App.ui.alert('La sesión expiró, debes ingresar de nuevo.', function () {
      try {
        App.user.logout(true)
      } catch (_) {
        window.location.href = '/error.html?e=401'
      }
    })
  }
}

function handleError(xhr) {
  let text, stat
  let show = true

  if (xhr && typeof xhr === 'object') {
    if (xhr.status === 401) {
      logOut()
      return
    }
    const json = xhr.responseJSON
    text = JSON.stringify(json || xhr.responseText || '?')
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN) + '…'
    stat = xhr.status
    if (stat === 404) show = false
    if (!navigator.onLine) text += ' (Trabajando sin conexión)'
  } else {
    stat = 'desconocido'
    text = 'No se recibió el objeto XHR en el controlador de errores ajax.'
  }

  App.error(`Error ${stat} en ${this.type} ${this.url}\nDatos: ${text}`, show)
}


function clean(s) {
  if (!s) return ''

  s = s.replace(/^(https?:\/\/.*)$/gm, '<a href="$1">$1</a>')

  return s.trim()
    .replace(/<br>/ig, '\n')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') || ''
}


function _serverSvc(url, method, opts) {

  url = _serverSvc.fullUrl(url)

  if (typeof method == 'string') {
    method = method.toUpperCase()
  } else {
    opts = method
    method = 'GET'
  }

  opts = assign({
    url,
    method,
    contentType: APPJSON,
    dataType: 'json',
    error: handleError
  }, opts)

  if (opts.data && typeof opts.data != 'string' && method !== 'GET' && opts.contentType === APPJSON) {
    opts.data = JSON.stringify(opts.data)
  }

  return $.ajax(opts)
}


_serverSvc.fromAuth = function (_id) {
  return App.server(App.config.AUTORIA_URL.replace('{id}', _id), {
    global: false,
    data: `apikey=${App.config.AUTORIA_KEY}`, // como string para q App.server no lo toque
    beforeSend: function () {}
  })
}


_serverSvc.fullUrl = function (url) {
  if (!/^https?:/.test(url)) {
    if (url[0] !== '/') url = `/${url}`
    url = App.config.API_BASE + url
  }
  return url
}

_serverSvc.errStr = function (xhr, raw) { // eslint-disable-line complexity
  if (!xhr) xhr = {}
  // auth?
  if (xhr.status === 401) {
    logOut()
    return ''
  }

  let msg1
  let msg2

  const json = xhr.responseJSON
  if (json) {
    msg1 = json.error || ''
    msg2 = json.message

    if (msg2) {
      if (Array.isArray(msg2)) {
        msg2 = msg2.join('\n')
      } else {
        msg2 = String(msg2.error || msg2 || '')
      }
      if (msg2.length > MAX_LEN) {
        msg2 = msg2.slice(0, MAX_LEN) + '…'
      }
    }
    if (json.detail) {
      msg2 = (msg2 ? msg2 + '\n' : '') + getDetails(json.detail)
    }

  } else if (xhr instanceof Error) {
    msg1 = '' + xhr
    if (msg1.startsWith('Error: ')) {
      msg1 = msg1.slice(7)
    }
  }

  if (!msg1 && !msg2) msg1 = xhr.statusText || 'Error desconocido.'
  else msg1 = ''

  // evita error php
  if (msg2 && msg2.indexOf('<!DOCTYPE ') < 0) {
    if (msg1.slice(-1) === '.') msg1 = msg1.slice(0, -1)
    if (msg1) {
      if (msg1.slice(-1) !== ':') msg1 += ':'
      if (msg1) msg1 += raw ? '\n' : '<br>'
    }
    msg2 = clean(msg2)
    msg1 += raw ? msg2 : `<i>${msg2.replace(/[\r\n]+/g, '<br>')}</i>`
  }

  return msg1
}

// Cuidado aquí, aun estamos manejando errores con mensajes no controlados
function getDetails(details) {
  if (Array.isArray(details)) {
    return details.map(line => {
      if (typeof line != 'string' || !line) {
        return ''
      }
      const idx = line.indexOf(':: ')
      return ~idx ? line.substr(idx + 3) : line
    })
    .join('\n')
  }
  return ''
}

_serverSvc.showError = function (xhr) {
  const err = _serverSvc.errStr(xhr)
  App.ui.toast.error(err)
  return err
}

/**
 * Exporta el comportamiendo para errores 401
 */
_serverSvc.logOut = logOut

/**
 * Exporta el comportamiendo para errores 401
 */
_serverSvc.logOut = logOut


module.exports = _serverSvc
