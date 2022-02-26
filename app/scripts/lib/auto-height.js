/*
 * Stretchy: Form element autosizing, the way it should be.
 * by Lea Verou http://lea.verou.me
 * MIT license
 */
(function ($) {

  // Support readonly styles (iOS)
  const setStyle = function (el, style, value) {
    try {
      el.style[style] = value
    } catch (_) {
      const styles = el.getAttribute('style')
      style = style.replace(/[A-Z]/g, (_, c) => '-' + c.toLowerCase()) + ':'
      const arr = styles
        ? styles.trim().split(/;\s+/).filter(a => !a.startsWith(style))
        : []
      arr.push(`${style} ${value}`)
      el.setAttribute('style', arr.join(';'))
    }
  }

  function getHeightOfLines(elem, lines) {
    const style = window.getComputedStyle(elem)
    const px2n  = px => px && parseInt(px, 10) || 0

    return px2n(style.lineHeight) * lines +
      px2n(style.borderTopWidth) + px2n(style.borderBottomWidth) +
      px2n(style.paddingTop) + px2n(style.paddingBottom)
  }


  function AutoHeight(element, options) {
    this.element = element
    this.options = $.extend({}, AutoHeight.DEFAULTS, options)

    $(element).addClass('autoheight')
              .on('input change', $.proxy(this.setHeight, this))
  }

  AutoHeight.DEFAULTS = {
    maxHeight: 25 * 22
  }

  // Autosize one element. The core of Stretchy.
  AutoHeight.prototype.setHeight = function () {
    const element = this.element

    // Will stretchy do anything for this element?
    if (!element.parentElement) {
      return
    }

    // we need at least one non-empty line
    const empty = !element.value
    if (empty) {
      element.value = element.placeholder || ' '
    }

    // grab the initial settings and set the max-height
    if (typeof element._autoheight_h != 'number') {
      element._autoheight_h = element.offsetHeight
      if (this.options.maxLines) {
        const mh = getHeightOfLines(element, this.options.maxLines)
        if (mh) setStyle(element, 'maxHeight', `${mh}px`)
      } else if (this.options.maxHeight) {
        setStyle(element, 'maxHeight', `${this.options.maxHeight}px`)
      }
      setStyle(element, 'minHeight', `${~~element.offsetHeight}px`)
      element.removeAttribute('rows')
    }

    // adds border's height to scrollHeight and set the new height
    setStyle(element, 'height', 'auto')
    const height = element.scrollHeight + (element.offsetHeight - element.clientHeight)
    setStyle(element, 'height', `${height}px`)
    if (empty) {
      element.value = ''
    }

    // trigger height-change event if neccesary and we are done
    const newHeight = element.offsetHeight
    if (element._autoheight_h !== newHeight) {
      element._autoheight_h = newHeight
      $(element).trigger('changed.bbs.autoheight', newHeight)
    }
  }

  function Plugin(option) {
    return this.each(function () {
      const $this   = $(this)
      const options = typeof option == 'object' && option
      let data = $this.data('bbs.autoheight')

      if (!data) {
        $this.data('bbs.autoheight', data = new AutoHeight(this, options))
      }
    })
  }

  $.fn.autoHeight             = Plugin
  $.fn.autoHeight.Constructor = AutoHeight

})(jQuery)
