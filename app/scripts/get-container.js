/**
 * Devuelve el elemento de tipo o clase "type" (contenedor intermedio) que contiene
 * al elemento "elem", ambos contenidos en el elemento raíz "root".
 *
 * @param   {Element} root - El elemento que contenedor raíz.
 * @param   {string}  type - El tipo/clase del elemento contenedor intermedio de "elem".
 * @param   {Element} elem - El elemento contenido.
 * @returns {Element|null} El contenedor intermedio o null si "elem" no está contenido.
 */
module.exports = function getContainer(root, type, elem) {
  'use strict'

  if (root.contains(elem)) {
    if (type[0] === '.') {
      type = type.slice(1)
      while (elem && elem !== root) {
        if (elem.classList.contains(type)) return elem
        elem = elem.parentNode
      }
    } else {
      type = type.toUpperCase()
      while (elem && elem !== root) {
        if (elem.nodeName === type) return elem
        elem = elem.parentNode
      }
    }
  }
  return null
}
