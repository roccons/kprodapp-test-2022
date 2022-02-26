/**
 * Lee los valores de un formulario, acepta un prefijo opcional para filtrar
 * los campos por su nombre, y que es removido de los nombres en el resultado.
 *
 * - Los valores se devuelven en un objeto { nombreCampo: valor }
 * - Sólo se devuelven campos con nombre, no deshabilitados y con valores no
 *   vacíos (y que inicien con el prefijo, si es que se recibió uno).
 * - El prefijo opcional se elimina de los nombres de campo resultantes.
 * - Los nombres de campo del form pueden contener un punto que se resuelve
 *   a un nombre objeto[propiedad] en el resultado (hasta un nivel).
 *   Por ej: "base.prop1" se resuelve a base['prop1']
 * - Los valores de los campos con class "has-integer" o "as-number" se
 *   convierten a números, sin truncar ni redondear.
 *
 * Un tercer parámetro puede ser `true` para devolver null si no el resultado
 * no contiene valores.
 *
 * @param   {Element} form - El formulario a leer
 * @param   {string} [prefix] - Prefijo de los nombres de campo
 * @param   {boolean} [emptyAsNull] - `true` para devolver null si no hay valores
 * @returns {Object} Resultados como { campo: valor, ...campoN: valorN }
 */
module.exports = function readForm(form, prefix, emptyAsNull) {  // eslint-disable-line complexity
  'use strict'

  const tokensAsArray = require('scripts/tokens-as-array')
  const fields = form.elements
  const length = fields.length
  const data = {}

  for (let i = 0; i < length; i++) {
    const f = fields[i]
    let name = f.name
    if (!name || f.disabled || prefix && !name.startsWith(prefix)) {
      continue
    }
    const type = f.type
    let isArr = false
    let value
    if (hasClass(f, 'has-tokens')) {
      value = tokensAsArray(f)
      isArr = true

    } else if (type === 'select-multiple') {
      value = Array.prototype.filter
        .call(f.options, o => o.selected).map(o => o.value).filter(Boolean)
      isArr = true

    } else if (type === 'select-one') {
      value = ~f.selectedIndex ? f[f.selectedIndex].value : ''

    } else if (type === 'checkbox' || type === 'radio') {
      value = f.checked ? f.value : ''
    } else {
      value = f.value.trim()
    }

    if (isArr) {
      if (!value.length) {
        continue
      }
      if (hasClass(f, 'as-number')) {
        value = value.map(Number)
      }
    } else {
      if (!value) {
        continue
      }
      if (hasClass(f, 'has-integer') || hasClass(f, 'as-number')) {
        value = +value || 0
      }
    }

    if (prefix) {
      name = name.slice(prefix.length)
    }


    const dash = name.indexOf('-')
    if (dash > 0) {
      value = name.slice(dash + 1)
      name  = name.slice(0, dash)
      ;(data[name] || (data[name] = [])).push(value)
    } else {
      data[name] = value
    }

    emptyAsNull = false
  }

  return emptyAsNull ? null : data
}
