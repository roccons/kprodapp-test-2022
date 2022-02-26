'use strict'

module.exports = $.site.extend({

  start() {

    // Creates the DOM for the whole page
    require('./site/main-page')

    initMenus()
    initTooltip()
    initFullscreen()

    // Init Loaded Components
    $.components.init()

    initClickActions()
  },

})

// ------------------------------------------------------------------------
// Menubar setup
// ------------------------------------------------------------------------

function initMenus() {

  // Adds menu to $.site
  $.site.menu = require('./site/menu')
  $.site.menu.init()

  // Adds menubar to $.site
  $.site.menubar = require('./site/menubar')

  function toggleMenubarCSS() {
    const $el = $(this.querySelector('.hamburger') || this)
    $el.toggleClass('hided',    !$.site.menubar.opened)
    $el.toggleClass('unfolded', !$.site.menubar.folded)
  }

  function collapseMenubar(e) {
    const $trigger = $(e.currentTarget)

    setTimeout(function () {
      const $body  = $(document.body)
      const isOpen = !$trigger.hasClass('collapsed')
      $body.addClass('site-navbar-collapsing')
        .toggleClass('site-navbar-collapse-show', isOpen)
      if (isOpen) $.site.menubar.scrollable.update()
      setTimeout(() => { $body.removeClass('site-navbar-collapsing') }, 350)
    }, 20)
  }

  function toggleMenubar() {
    $.site.menubar.toggle()
    return false
  }

  $('#site-menubar').on('changing.site.menubar', function () {
    $('#site-navbar').find('[data-toggle="menubar"]').each(toggleMenubarCSS)
    $.site.menu.refresh()
  })

  $('#site-navbar')
    .find('[data-toggle="menubar"]').click(toggleMenubar).end()
    .find('[data-toggle="collapse"]').click(collapseMenubar)

  $.site.menubar.init()

  Breakpoints.on('change', () => { $.site.menubar.change() })
}

// ------------------------------------------------------------------------
// Tooltip & Popover setup
// =======================
function initTooltip() {
  $(document).tooltip({
    selector: '[data-tooltip]',
    container: '#main-page',
    delay: 200
  })

  $('[data-toggle="tooltip"]').tooltip({ container: 'body' })
  $('[data-toggle="popover"]').popover()
}

// ------------------------------------------------------------------------
// Fullscreen
// ------------------------------------------------------------------------

function initFullscreen() {
  if (typeof screenfull != 'undefined') {
    const $btn = $('#toggleFullscreen').find('[data-toggle="fullscreen"]')

    $btn.click(() => {
      if (screenfull.enabled) screenfull.toggle()
      return false
    })

    if (screenfull.enabled) {
      document.addEventListener(screenfull.raw.fullscreenchange, () => {
        $btn.toggleClass('active', screenfull.isFullscreen)
      })
    }
  }
}

// ------------------------------------------------------------------------
// Click actions
// ------------------------------------------------------------------------

function initClickActions() {

  // previews para imagenes y video, descarga para otros?

  const goPreview = function () {
    let elem
    let path = this.getAttribute('data-path') ||
      (elem = this.querySelector('img,video')) && elem.getAttribute('src')
    if (path) {
      if (!/^https?:\//.test(path)) {
        path = `${App.config.FILES_BASE}/${path}`
      }
      if (!this.classList.contains('download-only')) {
        setImmediate(require('helpers/ipad-preview'), path)
      } else {
        $(`<a href="${path}" download target="_blank"></a>`)[0].click()
      }
    }
  }

  $(document).on('click', '.dz-image', goPreview)

  // Ocultación del sidebar con click en la página

  const externAnchor = function (node) {
    return node.nodeName === 'A' && node.href
         ? node.target && node.target !== '_self' : false
  }

  $('.page,.site-footer').click(function (e) {
    if (e.button !== 0) {
      return
    }
    const target = e.target

    // check only for main button (0) and if there's a viewer in screen
    if (hasClass(document.documentElement, 'slidePanel-html')) {
      // ignore clicks in links and already handled areas and modals
      if (target === e.currentTarget ||   //.page or .site-footer
         !externAnchor(target) &&
         !$(target).closest('.modal,.easyalert,.-keep-viewer').length) {
        $.slidePanel.closeView()
      }
    }

    // oculta los filtros
    const filters = document.getElementById('filters-sidebar-wrapper')
    if (filters) {
      const page = document.getElementById('main-wrapper')
      if (hasClass(page, 'filters-sidebar-open') &&
          target !== filters && !filters.contains(target) &&
          $(target).closest('.toggle-filters', page).length === 0) {
        // Daja a filtros cerrar para que puedan memorizar su estado
        App.trigger(App.EVT.CLOSE_FILTERS)
      }
    }
  })

  // Evita drop indeseado de archivo en áreas fuera de zonas drop

  function noDrop(e) {
    const p = $(e.target).closest('.dropzone')
    if (!p.length) {
      e.stopPropagation()
      e.preventDefault()
      const dt = e.originalEvent.dataTransfer
      dt.effectAllowed = dt.dropEffect = 'none'
    }
  }

  $(document).bind({ dragenter: noDrop, dragover: noDrop })

  //
  // Handles clicks in the button inside of the main menubar footer
  //
  const $footer = $('.site-menubar-footer')
  const userLogout = require('scripts/services/user').logout
  const userLock = require('modules/users/user-lock')
  const userPrefs = require('modules/users/userPrefs')

  $('#site-navbar-collapse .-user-prefs').click(userPrefs)
  $('#user-top-info .-user-logout').click(userLogout)

  $footer.find('[data-action=prefs]').click(userPrefs)
  $footer.find('[data-action=logout]').click(userLogout)
  $footer.find('[data-action=lock]').click(userLock)
}
