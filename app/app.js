'use strict'

const loadRemoteData = require('./scripts/load-remote-data')
const userLogin = require('./modules/users/user-login')

// Agrega extensiones a jQuery
require('./scripts/extend-jquery')

/**
 * The main App object
 * -------------------
 */
const app = require('./scripts/create-app') // crea window.App

/**
 * Se ejecuta con cada cambio de página.
 * Guarda el nombre de la sección en `window.document` y establece
 * el título de la ventana de acuerdo a la sección.
 *
 * @param {*} section Nombre de la sección
 */
const setSection = section => {
  const title = app.sections.titles[section] || '?'

  document.section = section
  document.title = window.title = `${title} - ${app.config.APP_TITLE}`
  $(document.body).removeClassEx(app.sections.RE).addClass(section)
  $('#site-navbar').find('h1').text(title)
  $('#main-menu')
    .children()
    .each((_, element) => {
      element.classList.toggle('active', element.getAttribute('data-section') === section)
    })
}

/**
 * Limpia el markup de la página y el contexto de la aplicación.
 */
const clearContext = () => {
  const $body = $(document.body)

  app.store.clear()

  $.Dropzone.instances.length = 0
  $(window).off('resize orientationchange')
  $body.children('span').find('[style*="top:-999px"]:empty').remove() // tokenfield trash
  $body.children('.modal-backdrop,.easyalert').remove() // por cambio manual de url con modal abierto
}

/**
 * Muestra u oculta el spinner que indica que la página está cargando.
 * @param {boolean} [on=false] Si es `true` se muestra.
 */
const showLoader = on => {
  $(document.body)
    .children('.loader')
    .toggleClass('loader-default', on === true)
}

/**
 * Función llamada en cada cambio de página hecho por el router.
 * Las rutas no válidas son manejadas por el controlador 'noRoute'.
 */
const changePage = function () {
  const _this = this
  const data = {
    path: _this.path,
    pageTitle: _this.pageTitle,
    section: _this.section,
    frame: _this.frame || '#main-page',
    noSpinner: _this.noSpinner,
    params: _this.params,
  }
  const controller = require(app._router.controllersPath + _this.controller)

  if (!app.user.logged()) {
    location.href = '/'
  } else {
    let sbox
    let more = false

    if (controller.preloader) {
      more = controller.preloader(data)
      if (more === false) {
        return
      }
    }

      // set document.section to the route.section property
      // and sync the main menu with this.
    setSection(data.section)

      // data.frame can be changed in preloader
    if (data.frame === '#main-page') {
        // solamente si el controlador se ejecuta en #main-page
      clearContext()

      sbox = '#main-wrapper'
      if (data.noSpinner !== true) {
        showLoader(true)
      }
    } else {
      sbox = data.frame
    }

      // Está todo preparado para llamar a la transición de página.
    app.trigger(app.EVT.FADE_START, data)

      // El difuminado del encabezado no se puede iniciar desde un evento
      // pues queda desincronizado del fade de #main-page
    let $header
    if (_this.fadeHeader) {
      $header = $('#site-navbar').children('.navbar-container')
      $header.stop(true, true).fadeOut({ duration: 300, easing: 'linear' })
    }

      // FadeOut de #main-page
    $(sbox)
        .stop(true, true)
        .fadeOut(300, 'linear', () => {
          const duration = data.noSpinner ? 400 : 800

          // Se notifica que ahora la página está en blanco.
          // Este es un buen momento para aplicar cambios globales al aspecto.
          app.trigger(app.EVT.PAGE_CLEARED, data)
          $(data.frame).off().empty()

          controller(data.frame, data, more)

          // Inicia el fadeIn
          $(sbox).fadeIn(duration, _this.keepLoader ? $.noop : showLoader)
          if ($header) {
            $header.fadeIn(duration)
          }
        })
  }
}

/**
 * Inicialización del router.
 * Todas las rutas serán direccionadas a `pageChange`.
 */
const startRouter = () => {
  const routes = require('routes')

  app._router.controllersPath = routes.controllersPath

    // "exit" se ejecuta antes de "enter" en cada cambio de hash
  app._router
    .exit(function () {
      app.trigger(app.EVT.ROUTE_EXIT, this)
    })
    .enter(function () {
      // hide Tooltips and notifications
      $.hideTooltips()
      app.trigger(app.EVT.ROUTE_ENTER, this)
    })
    .rescue(require('modules/notFound'))
    .concat(routes.routes, changePage)
    .listen('/')
}

/**
 * Función a ejecutar después que el usuario inicia sesión.
 */
app.run = function () {
  loadRemoteData()
    .done(() => {
      // App es alias de $.site, pero `site` es más descriptivo para `start`,
      // que se encarga de cargar el frame del sitio propiamente dicho.
      app.start()

      require('scripts/set-components')
      require('modules/pusher/init')

      startRouter()
    })
    .fail(err => {
      console.warn(err)
      app.ui.toast.error(app.server.errStr(err))
    })
}

// Iniciar sesión
userLogin()
