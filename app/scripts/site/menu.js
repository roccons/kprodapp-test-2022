'use strict'

module.exports = {

  speed: 250,

  // changes the collapsible behavior to expandable instead of the default accordion style
  accordion: true,

  init() {
    this.$instance = $('.site-menu')

    if (this.$instance.length === 0) {
      return
    }

    this.bind()
  },

  bind() {
    const _this = this

    this.$instance

      .on('mouseenter.site.menu', '.site-menu-item', function () {
        const $item = $(this)
        //#if _SUBMENUS
        if ($.site.menubar.folded === true && $item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
          const $sub = $item.children('.site-menu-sub')
          _this.position($item, $sub)
        }
        //#endif
        $item.addClass('hover')
      })

      .on('mouseleave.site.menu', '.site-menu-item', function () {
        const $item = $(this)
        //#if _SUBMENUS
        if ($.site.menubar.folded === true && $item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
          $item.children('.site-menu-sub').css('max-height', '')
        }
        //#endif
        $item.removeClass('hover')
      })

      .on('deactive.site.menu', '.site-menu-item.active', function (e) {
        this.classList.remove('active')
        e.stopPropagation()
      })

      .on('active.site.menu', '.site-menu-item', function (e) {
        this.classList.add('active')
        e.stopPropagation()
      })

      .on('open.site.menu', '.site-menu-item', function (e) {
        const $item = $(this)

        _this.expand($item, function () {
          $item.addClass('open')
        })
        if (_this.accordion) {
          $item.siblings('.open').trigger('close.site.menu')
        }
        e.stopPropagation()
      })

      .on('close.site.menu', '.site-menu-item.open', function (e) {
        const $item = $(this)

        _this.collapse($item, function () {
          $item.removeClass('open')
        })
        e.stopPropagation()
      })

      .on('click.site.menu ', '.site-menu-item', function (e) {
        const $item = $(this)

        if ($item.is('.has-sub') && $(e.target).closest('.site-menu-item').is(this)) {
          if ($item.is('.open')) {
            $item.trigger('close.site.menu')
          } else {
            $item.trigger('open.site.menu')
          }
        } else if (!$item.is('.active')) {
          $item.siblings('.active').trigger('deactive.site.menu')
          $item.trigger('active.site.menu')
        }
        e.stopPropagation()
      })

      .on('tap.site.menu', '>.site-menu-item>a', function () {
        const link = this.getAttribute('href')

        if (link) window.location = link
      })

      //#if _SUBMENUS
      .on('touchend.site.menu', '>.site-menu-item>a', function () {
        const $item = $(this.parentNode)

        if ($.site.menubar.folded) {
          if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
            $item.siblings('.hover').removeClass('hover')
            $item.toggleClass('hover')
          }
        }
      })

      .on('scroll.site.menu', '.site-menu-sub', function (e) {
        e.stopPropagation()
      })
      //#endif
  },  // end of bind()

  collapse($item, callback) {
    //#if _SUBMENUS
    const _this = this
    const $sub  = $item.children('.site-menu-sub')

    $sub.show().slideUp(this.speed, function () {
      $(this).css('display', '').children('.site-menu-item').removeClass('is-shown')
      if (callback) {
        callback()
      }
      _this.$instance.trigger('collapsed.site.menu')
    })
    //#endif
  },

  expand($item, callback) {
    //#if _SUBMENUS
    const _this = this
    const $subs = $item.children('.site-menu-sub')
    const $children = $subs.children('.site-menu-item').addClass('is-hidden')

    $subs.hide().slideDown(this.speed, function () {
      this.style.display = ''
      if (callback) {
        callback()
      }
      _this.$instance.trigger('expanded.site.menu')
    })

    setImmediate(function () {
      $children.addClass('is-shown').removeClass('is-hidden')
    })
    //#endif
  },

  //#if _SUBMENUS
  position($item, $dropdown) {
    const menubarHeight = $.site.menubar.$instance.outerHeight()
    const itemHeight = $item.children('a').outerHeight()
    let offsetTop = $item.position().top

    $dropdown.removeClass('site-menu-sub-up').css('max-height', '')

    if (offsetTop > menubarHeight / 2) {
      $dropdown.addClass('site-menu-sub-up')
      if ($.site.menubar.foldAlt) offsetTop -= itemHeight
      $dropdown.css('max-height', itemHeight + offsetTop)
    } else {
      if ($.site.menubar.foldAlt) offsetTop += itemHeight
      $dropdown.removeClass('site-menu-sub-up')
      $dropdown.css('max-height', menubarHeight - offsetTop)
    }
  },
  //#endif

  refresh() {
    this.$instance.find('.open').not('.active').removeClass('open')
  }
}
