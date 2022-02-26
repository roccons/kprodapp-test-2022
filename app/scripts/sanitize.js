'use strict'

const encode = require('./encode')

const isEscaped = url => /%[\da-fA-F]{2}/.test(url)

/*
 * Limpia la cadena de texto recibida.
 * Si la cadena contiene un URL o se recibe `isURL` verifica que la cadena
 * no esté ya codificada buscando un patrón "%HH" para evitar la doble
 * codificación (se asume que está codificada por completo).
 *
 * @param {string} s Cadena a sanitizar
 * @param {boolean} [isURL=false] `true` si el texto contiene un URL
 */
module.exports = function sanitize(s, isURL) {

  if (!s) return ''

  const proto = /^https?:\/\//.exec(s)

  if (proto || isURL) {
    const text = sanitize(proto ? s.slice(proto[0].length) : s)
    const url = isEscaped(s) ? s : encodeURI(s)
    return `<a href="${url}" target="_blank" class="break-any">${text}</a>`
  }

  return encode(s)
}
