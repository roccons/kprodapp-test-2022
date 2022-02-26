/**
 * jQuery plugin for Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */
(function (UNDEF) {
  'use strict'

  /**
   * jQuery plugin for Sortable
   * @param   {Object|String} options
   * @param   {..*}           [args]
   * @returns {jQuery|*}
   */
  $.fn.sortable = function (options) {
    const Sortable = require('scripts/lib/sortablejs')
    const args = arguments
    let retVal

    this.each(function () {
      const $el = $(this)
      let sortable = $el.data('sortable')

      if (!sortable && (options instanceof Object || !options)) {
        sortable = new Sortable(this, options)
        $el.addClass('sortable').data('sortable', sortable)
      }

      if (sortable) {
        if (options === 'widget' || options === true) {
          retVal = sortable

        } else if (options === 'destroy') {
          sortable.destroy()
          $el.removeData('sortable')

        } else if (typeof sortable[options] == 'function') {
          retVal = sortable[options].apply(sortable, [].slice.call(args, 1))

        } else if (options in sortable.options) {
          retVal = sortable.option.apply(sortable, args)
        }
      }
    })

    return (retVal === UNDEF) ? this : retVal
  }
})();
