/**
 * Crea el popup para el login.
 *
 * Note que este popup puede ser el de inicio, que no comparte espacio con
 * otros elementos de la página, o puede ser el de reinicio, que se sobrepone
 * a otros elementos y solamente muestra el campo para la contraseña.
 *
 * El popup de inicio de sesión no puede cerrarse excepto con el botón.
 *
 * @param {string} html -
 * @returns {*[]}
 */
module.exports = function (html) {
  'use strict'

  $(document.body).children('.loader-default').removeClass('.loader-default')
  $('#user-login').css('opacity', 1)

  // Busca el elemento del form, si no existe se creará.
  return $('#user-login-form').off().html(html)
}
