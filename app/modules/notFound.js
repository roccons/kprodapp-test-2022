'use strict'

module.exports = function (el) {
  const html =
      '<div class="page-content"><div style="position:relative;text-align:center;padding-top:7.5%">' +
        '<p><img src="images/error.png" width="75" alt="Error 404"></p>' +
        '<p><h2>Página no encontrada</h2></p>' +
      '</div></div>'

  const h1 = document.querySelector('#site-navbar h1')
  if (h1) h1.innerHTML = 'Error'

  el = document.getElementById('main-page') || document.body
  el.innerHTML = html
}
