const getMediaType = require('scripts/get-media-type')

const createTzo = app => {

  // App.tzo es una propiedad dinámica de solo-lectura con el offset horario
  var __tzo = ''      // eslint-disable-line

  Object.defineProperty(app, 'tzo', {
    get: () => __tzo,
    enumerable: true,
  })

  // Actualiza el valor App.tzo cada 30 minutos
  function setTzo() {
    const tzo  = new Date().getTimezoneOffset() * 100 / 60
    const sign = tzo > 0 ? '-' : '+'
    const _tzo = sign + ('0000' + Math.abs(tzo)).slice(-4)

    if (_tzo !== __tzo) {
      App.tzo = __tzo
      App.trigger('config-change')
    }
  }

  setInterval(setTzo, 1800000)  // cada 30 mins (1000 * 60 * 30)
  setTzo()                      // realiza la primer actualización de tzo
}

const createRegex = (s, flags) =>
  new RegExp(String(s).replace(/(?=[[\]()*+?.^$|\\])/g, '\\'), flags)

/*
 * Load the given page
 */
const goToPage = (path, force) => {
  if (path[0] !== '#') {
    path = (path[0] === '/' ? '#' : '#/') + path
  }
  App._router.navigate(path, force)
}

const genericIcon = (path, title) => {
  if (path && !title) {
    const type = getMediaType(path)
    title = type && `${type[0].toUpperCase()}${type.slice(1)}`
  }
  return `<i class="icon wb-file" title="${title || ''}"></i>`
}

const refreshTables = (evt, ctx) => {
  if (document.section === 'boards') {
    App.trigger(App.EVT.DATA_UPDATED, evt, ctx)
  } else {
    $('#main-page')
      .find('.bootstrap-table')
      .find('.fixed-table-body table')
      .bootstrapTable('refresh')
  }
}

/*
  The main App object
  -------------------
*/

// First the core data and services
;(function (self) {

  // el objeto a extender, que creará un alias como $.site
  const app = self.App = require('./site')

  const def = (prop, value) => {
    Object.defineProperty(app, prop, { value, enumerable: true })
  }

  // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769#9851769
  const ua = navigator.userAgent
  if (window.StyleMedia) {
    app.isEdge = true
  } else if (window.InstallTrigger) {
    app.isFF = true
  } else if (window.chrome && window.chrome.webstore) {
    app.isChrome = true
  } else if (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
      ua && ~ua.indexOf('Safari/') && !/(CriOS|Chrom(e|ium)\/)/.test(ua)) {
    app.isSafari = true
  }

  const config = require('config')
  def('name',    config.APP_TITLE)
  def('version', config.version)
  def('config',  config)

  // agrega las definiciones de eventos globales
  const store = require('./services/app-store')
  def('store', store)
  def('EVT', {
    DATA_UPDATED: '~data-update',
    CLOSE_FILTERS: '~close-filters',
    ROUTE_ENTER: '~route-enter',
    ROUTE_EXIT: '~route-exit',
    FADE_START: '~page-fade',
    PAGE_CLEARED: '~page-clear',
    KN_NOTIF: '~kn-notif',
  })

  /*
    Coloca en el objeto config propiedades que acceden al storage del navegador.
    ls: localStorage (memoria permanente) bajo es namespace "___user__"
    rt: sessionStorage, almacenamiento transitorio, usado en "run-time"
  */
  const store2 = require('store2')
  config.ls = store2.namespace('__user_')
  config.rt = store2.session

  // Método debounce obtenido de underscore
  def('debounce', require('./lib/debounce'))

  // éstos antes que los otros, para poder ser usados por ellos
  def('ui',       require('./services/app-ui'))
  def('error',    require('./services/app-log').error)
  def('log',      require('./services/app-log').log)

  // lo siguiente permite llamar métodos de "store" directo con App
  def('trigger',  store.trigger)
  def('on',       store.on)
  def('off',      store.off)
  def('one',      store.one)

  // el resto de los módulos
  def('server',     require('./services/app-server'))
  def('catalogs',   require('./services/catalogs'))
  def('user',       require('./services/user'))
  def('sideViewer', require('./services/side-viewer'))

  // Funciones utilitarias
  def('createRegex',   createRegex)
  def('goToPage',      goToPage)
  def('genericIcon',   genericIcon)
  def('refreshTables', refreshTables)

  // Agrega la propiedad dinámica "tzo"
  createTzo(app)

  // Para que App.setSection agilize el cambio de entorno cuando hay cambio de sección
  const menu = require('../routes').menu
  def('sections', {
    // títulos de las secciones
    titles: menu.reduce((o, r) => (o[r.section] = r.title.replace(/&nbsp;/g, ' ')) && o, {}),
    // regex para cambio de class de document.body
    RE: RegExp(`^(?:${menu.map(r => r.section).join('|')})$`),
  })

  // El router no es enumerable
  Object.defineProperty(app, '_router', { value: require('easyrouter') })

  // "h" debe estar presente en el entorno global para permitir entrar
  // directo a un reto.
  self.h = require('dio.js').h

})(window)

module.exports = App
