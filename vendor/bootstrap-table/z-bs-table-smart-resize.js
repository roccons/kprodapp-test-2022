/**
 * @author: Dennis Hernández
 * @webSite: http://djhvscf.github.io/Blog
 * @version: v1.1.0
 */
/*eslint consistent-this: [2, "that"] */

!(function ($) {  // eslint-disable-line no-unused-expressions
  'use strict'

  function _getWidthFn(_that) {
    var el = _that.$el.closest('.fixed-table-container')[0]
    return el && el.offsetWidth || 0
  }

  function showHideColumns(_that, checked) {
    if (_that.options.columnsHidden.length > 0) {
      $.each(_that.columns, function (i, column) {
        if (column.visible !== checked && ~_that.options.columnsHidden.indexOf(column.field)) {
          _that.toggleColumn($.fn.bootstrapTable.utils.getFieldIndex(_that.columns, column.field), checked, true)
        }
      })
    }
  }

  function changeTableView(_that, cardView) {
    if (_that.options.cardView !== cardView) {
      _that.options.cardView = !cardView
      _that.toggleView()
      showHideColumns(_that, !cardView)
    }
  }

  function changeView(_that, width) {
    if (width <= _that.options.minWidth) {
      changeTableView(_that, true)    // go card view
    } else {
      changeTableView(_that, false)   // go full view
    }

    // reset the view
    if (_that.options.height || _that.options.showFooter) {
      setTimeout(function () {
        _that.resetView()
      }, 1)
    }
  }

  // Returns a function to reset the view for the given ID only if the height
  // has changed by at least the threshold.
  function resizeHandler(jqId) {
    var ctx = {
      handle: null,
      oldWidth: 0,
      jqId: jqId
    }

    ctx.checkWidth = $.proxy(function () {
      this.handle = null
      var bsTable = $(this.jqId).children('table').data('bootstrap.table')
      if (bsTable) {
        var width = bsTable.options.getWidthFn(bsTable)
        if (width && ctx.oldWidth !== width) {
          changeView(bsTable, width)
          ctx.oldWidth = width
        }
      } else {
        $(window).off('resize orientationchange', _resizeHandler)
      }
    }, ctx)

    function _resizeHandler() {
      var _that = ctx
      clearTimeout(_that.handle)
      _that.handle = setTimeout(_that.checkWidth, 200)
    }

    return _resizeHandler
  }

  $.extend($.fn.bootstrapTable.defaults, {
    mobileResponsive: false,
    minWidth: 560,
    getWidthFn: _getWidthFn,
    checkOnInit: true,
    columnsHidden: []
  })

  var BootstrapTable = $.fn.bootstrapTable.Constructor
  var _init = BootstrapTable.prototype.init
  var __id = 1

  BootstrapTable.prototype.init = function () {
    _init.apply(this, Array.prototype.slice.apply(arguments))

    var opts = this.options
    if (!opts.mobileResponsive || !opts.minWidth) {
      return
    }

    if (opts.minWidth < 100 && opts.resizable) {
      console.error('The minWidth when the resizable extension is active should be greater or equal than 100')
      opts.minWidth = 100
    }

    var resizeId = '_bs_smart_resize_' + __id++
    var resizeFn = resizeHandler('#' + resizeId)

    this.$el.get(0).parentNode.id = resizeId
    $(window).on('resize orientationchange', resizeFn)
    if (opts.checkOnInit) {
      resizeFn()
    }
  }

})(jQuery)
