/*
 * jQuery.splitter.js - two-pane splitter window plugin
 *
 * version 1.51 (2009/01/09)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * The splitter() plugin implements a two-pane resizable splitter window.
 * The selected elements in the jQuery object are converted to a splitter;
 * each selected element should have two child elements, used for the panes
 * of the splitter. The plugin adds a third child element for the splitbar.
 *
 * For more details see: http://methvin.com/splitter/
 */
(function ($) {

  var RE_CLICK = /\bes-click\b/
  var DEFAULTS = {
    h: {					// horizontal splitter
      type: 'h', keyTop: 40, keyBottom: 38,
      outerClass: 'hsplitter',
      cursor: ['n-resize', 's-resize'],
      eventPos: 'pageY', origin: 'top', cssSize: 'height', pxSize: 'offsetHeight'
    },
    v: {					// vertical splitter
      type: 'v', keyLeft: 39, keyRight: 37,
      outerClass: 'vsplitter',
      cursor: ['w-resize', 'e-resize'],
      eventPos: 'pageX', origin: 'left', cssSize: 'width', pxSize: 'offsetWidth'
    },
    bar: '<span class="icon fa-caret-up es-click es-left"></span>' +
         '<span class="es-dots">&bull;&bull;&bull;</span>' +
         '<span class="icon fa-caret-down es-click es-right"></span>'
  }

  $.fn.splitter = function (args) {
    args = args || {}

    return this.each(function () {
      var el    = this //eslint-disable-line
      var isIE  = (window && window.document || {}).documentMode | 0
      var paneA = el.children[0]
      var paneB = el.children[1]
      var inner = paneB.children[0]

      // Determine settings based on incoming opts, element classes, and defaults
      var vh    = args.type || 'v'
      var opts  = $.extend({
        pxPerKey: 8,			            // splitter px moved per keypress
        tabIndex: 0,			            // tab order indicator
        accessKey: ''			            // accessKey for splitbar
      }, DEFAULTS[vh], args)

      // Create jQuery object closures for splitter and both panes
      var $element = $(el).addClass('splitter ' + opts.outerClass)
      var $panes  = $([paneA, paneB, inner])

      paneB.className = (paneB.className + ' es-pane-b').trim()
      inner.className = (inner.className + ' es-pane-c').trim()

      var bar = document.createElement('div')
      bar.setAttribute('unselectable', 'on')
      bar.className = 'splitbar'
      bar.innerHTML = DEFAULTS.bar
      paneB.insertBefore(bar, paneB.firstChild)

      // Focuser element, provides keyboard support; title is shown by Opera accessKeys
      /*
      var focuser = $('<a href="javascript:void(0)"></a>')
        .attr({
          accessKey: opts.accessKey,
          tabIndex: opts.tabIndex,
          title: opts.barClass
        })
        .bind(window.opera ? 'click' : 'focus', function () { this.focus(); $bar.addClass('es-active') })
        .bind('blur', function () { $bar.removeClass('es-active') })
        .bind('keydown', function (e) {
          var key = e.which || e.keyCode
          var dir = key === opts['key' + opts.side1] ? 1 : key === opts['key' + opts.side2] ? -1 : 0
          if (dir) resplit(el.__pos + dir)
        })
      */

      bar.addEventListener('mousedown', startSplitMouse, false) //.append(focuser)

      function doResize(nTop, maxS) {
        // Resize/position the two $panes
        paneA.style[opts.cssSize] = nTop + 'px'
        maxS -= nTop
        paneB.style[opts.cssSize] = maxS + 'px'
        // only IE fires resize
        if (!isIE) $panes.trigger('resize')
      }

      function hidePane(bar, btn) {
        var nPos = bar[opts.pxSize]
        var barS = bar[opts.pxSize]
        var maxS = el[vh === 'v' ? 'clientWidth' : 'clientHeight']

        // Constrain new splitbar position to fit pane size limits
        // Splitbar is at bottom of the top pane
        var nTop = ~btn.className.indexOf('es-left') ? 0 : maxS - barS
        if (nTop === nPos) return

        $element.addClass('scrollpane')
        setTimeout(function () {
          $element.removeClass('scrollpane').trigger('stop')
        }, 250)

        doResize(nTop, maxS)
      }

      function doSplitMouse(evt, end) {
        var newPos = evt[opts.eventPos]
        var offset = newPos - el.__pos

        evt.preventDefault()
        evt.stopPropagation()
        el.__pos = newPos
        if (!offset) return

        var nTop = paneA[opts.pxSize]
        var barS = bar[opts.pxSize]
        var maxS = el[vh === 'v' ? 'clientWidth' : 'clientHeight'] - barS

        // Constrain new splitbar position to fit pane size limits
        // Splitbar is at bottom of the top pane
        nTop += offset
        var ovr = nTop < 0 || nTop > maxS
        if (ovr) {
          nTop = nTop < 0 ? 0 : maxS
        }

        var n = offset < 0 ? 0 : 1
        if (bar.__csr !== n) {
          bar.style.cursor = opts.cursor[bar.__csr = n]
        }
        doResize(nTop, maxS + barS)

        if (ovr && end !== true) endSplitMouse()
      }

      function startSplitMouse(evt) {
        if (evt.button || evt.defaultPrevented) {
          return
        }
        if (RE_CLICK.test(evt.target.className)) {
          endSplitMouse(evt)
          hidePane(evt.currentTarget, evt.target)
        } else {
          evt.stopPropagation()
          el.__pos = evt[opts.eventPos]
          if (!el.__active) {
            el.__active = true
            el.className += ' es-active'
            document.addEventListener('mousemove', doSplitMouse, true)
            document.addEventListener('mouseup',  endSplitMouse, true)
            $element.trigger('start')
          }
        }
      }

      function endSplitMouse(evt) {
        if (el.__active) {
          el.__active = false
          //evt.stopPropagation()
          $element.removeClass('es-active')
          document.removeEventListener('mousemove', doSplitMouse, true)
          document.removeEventListener('mouseup',  endSplitMouse, true)
          doSplitMouse(evt, true)
          delete el.__pos
          bar.style.cursor = ''
          $element.trigger('stop')
        }
      }

    })
  }

})(jQuery)
