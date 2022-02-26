/*
http://stackoverflow.com/questions/20572734/load-event-not-firing-when-iframe-is-loaded-in-chrome
*/

let _uid = 0

module.exports = function _downloader(fname) {
  'use strict'

  if (_uid++ > 0xffff) _uid = 0
  const frmId = `frm-downloader-${_uid}`

  if (/firefox/i.test(navigator.userAgent)) {
    window.location.assign(fname)
    return frmId
  }

  function removeIFrame(evt) {
    const el = evt.target
    el.removeEventListener('load',  removeIFrame, false)
    el.removeEventListener('error', removeIFrame, false)
    document.body.removeChild(el)
  }

  // Se limita el tiempo de espera a 5 minutos
  // para evitar generar un error 500 en el API
  // (MAX_EXECUTION_TIME)
  function removeTimed(ids) {
    setTimeout(function () {
      const el = document.getElementById(ids)
      if (el) removeIFrame.call(el, { target: el })
    }, 1000 * 300)   // 5 minute
  }

  const frame = document.createElement('iframe')

  frame.id = frmId
  frame.setAttribute('style', 'display:none;position:absolute;right:999999px')
  frame.setAttribute('src', fname)
  document.body.appendChild(frame)
  frame.addEventListener('load',  removeIFrame, false)
  frame.addEventListener('error', removeIFrame, false)

  removeTimed(frmId)

  return frmId
}
