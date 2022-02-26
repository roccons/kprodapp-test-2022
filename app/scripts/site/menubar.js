'use strict'

const $body = $('body')
const $html = $('html')

module.exports = {
  opened: null,
  folded: null,
  top: false,
  foldAlt: false,
  $instance: null,
  auto: true,

  init() {
    $html.removeClass('css-menubar').addClass('js-menubar')

    this.$instance = $('.site-menubar')

    if (!this.$instance.length) return

    if ($body.is('.site-menubar-top')) {
      this.top = true
    }

    if ($body.is('.site-menubar-fold-alt')) {
      this.foldAlt = true
    }

    //if ($body.data('autoMenubar') === false || $body.is('.site-menubar-keep')) {
    //  if ($body.hasClass('site-menubar-fold')) {
    //    this.auto = 'fold'
    //  } else if ($body.hasClass('site-menubar-unfold')) {
    //    this.auto = 'unfold'
    //  }
    //}

    this.$instance.on('changed.site.menubar', () => {
      this.update()
    })

    if ($body.hasClass('site-menubar-unfold')) {
      this.change('unfold')
    } else if ($body.hasClass('site-menubar-fold')) {
      this.change('fold')
    } else {
      this.change()
    }
  },

  change(auto) {
    const breakpoint = Breakpoints.current()
    const bp = breakpoint && breakpoint.name

    this.reset()

    if (bp === 'xs') {
      this.hide()
      return
    }

    if (typeof auto != 'string') {
      auto = this.auto
    }

    if (auto === 'fold') {
      this.fold()
    } else if (auto === 'unfold' || bp === 'lg') {
      this.unfold()
    } else {
      this.fold()
    }
  },

  animate(doing, callback) {
    $body.addClass('site-menubar-changing')

    doing.call(this)
    this.$instance.trigger('changing.site.menubar')

    setTimeout(() => {
      callback.call(this)
      $body.removeClass('site-menubar-changing')
      this.$instance.trigger('changed.site.menubar')
    }, 500)
  },

  reset() {
    this.opened = null
    this.folded = null
    $body.removeClass('site-menubar-hide site-menubar-open site-menubar-fold site-menubar-unfold')
    $html.removeClass('disable-scrolling')
  },

  open() {
    if (this.opened !== true) {
      this.animate(
        function () {
          $body.removeClass('site-menubar-hide').addClass('site-menubar-open site-menubar-unfold')
          this.opened = true
          $html.addClass('disable-scrolling')
        },
        function () {
          this.scrollable.enable()
        }
      )
    }
  },

  hide() {
    this.hoverscroll.disable()

    if (this.opened !== false) {
      this.animate(
        function () {
          $html.removeClass('disable-scrolling')
          $body.removeClass('site-menubar-open').addClass('site-menubar-hide site-menubar-unfold')
          this.opened = false
        },
        function () {
          this.scrollable.enable()
        }
      )
    }
  },

  unfold() {
    this.hoverscroll.disable()

    if (this.folded !== false) {
      this.animate(
        function () {
          $body.removeClass('site-menubar-fold').addClass('site-menubar-unfold')
          this.folded = false
        },
        function () {
          this.scrollable.enable()
          if (this.folded !== null) $.site.resize()
        }
      )
    }
  },

  fold() {
    this.scrollable.disable()

    if (this.folded !== true) {
      this.animate(
        function () {
          $body.removeClass('site-menubar-unfold').addClass('site-menubar-fold')
          this.folded = true
        },
        function () {
          this.hoverscroll.enable()
          if (this.folded !== null) $.site.resize()
        }
      )
    }
  },

  toggle() {
    const breakpoint = Breakpoints.current()
    const folded = this.folded
    const opened = this.opened

    switch (breakpoint.name) {
      case 'lg':
        if (folded === null || folded === false) {
          this.fold()
        } else {
          this.unfold()
        }
        break
      case 'md':
      case 'sm':
        if (folded === null || folded === true) {
          this.unfold()
        } else {
          this.fold()
        }
        break
      case 'xs':
        if (opened === null || opened === false) {
          this.open()
        } else {
          this.hide()
        }
        break
      default:
        break
    }
  },

  update() {
    this.scrollable.update()
    this.hoverscroll.update()
  },

  scrollable: {
    api: null,
    native: false,
    init() {
      // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      //   this.native = true;
      //   $body.addClass('site-menubar-native');
      //   return;
      // }

      if ($body.is('.site-menubar-native')) {
        this.native = true
        return
      }

      this.api = $.site.menubar.$instance.children('.site-menubar-body').asScrollable({
        namespace: 'scrollable',
        skin: 'scrollable-inverse',
        direction: 'vertical',
        contentSelector: '>',
        containerSelector: '>'
      }).data('asScrollable')
    },

    update() {
      if (this.api) {
        this.api.update()
      }
    },

    enable() {
      if (this.native) {
        return
      }
      if (!this.api) {
        this.init()
      }
      if (this.api) {
        this.api.enable()
      }
    },

    disable() {
      if (this.api) {
        this.api.disable()
      }
    }
  },

  hoverscroll: {
    api: null,

    init() {
      this.api = $.site.menubar.$instance.children('.site-menubar-body').asHoverScroll({
        namespace: 'hoverscorll',
        direction: 'vertical',
        list: '.site-menu',
        item: '> li',
      //#if _SUBMENUS
        exception: '.site-menu-sub',
      //#endif
        fixed: false,
        pointerScroll: false,
        boundary: 100,
        onEnter() {
          //$(this).siblings().removeClass('hover');
          //$(this).addClass('hover');
        },
        onLeave() {
          //$(this).removeClass('hover');
        }
      }).data('asHoverScroll')
    },

    update() {
      if (this.api) {
        this.api.update()
      }
    },

    enable() {
      if (!this.api) {
        this.init()
      }
      if (this.api) {
        this.api.enable()
      }
    },

    disable() {
      if (this.api) {
        this.api.disable()
      }
    }
  }
}
