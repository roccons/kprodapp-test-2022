/**
 * Preserves the check marks for server-side data.
 * For server-side pagination it works only in the current page.
 *
 * @author: aMarCruz
 * @version: v1.0.0
 */

!(function ($) {          // eslint-disable-line no-unused-expressions
  'use strict'

  // On error, make sure that _savedMarkedIds doesn't keep wrong marks
  function _removeIds() {
    this._savedMarkedIds = false
  }

  // Restores the marked rows directly in the endpoint response
  function _initData(data) {
    var ids = this.$el[0]._savedMarkedIds

    if (ids) {
      var uid = this.options.uniqueId
      var checkName = this.header.stateField

      ids.forEach(function (id) {
        var dest = data.find(function (d) { return d[uid] === id })
        if (dest) dest[checkName] = true
      })

      this.$el[0]._savedMarkedIds = false
    }

    this._bst_initData(data)
  }

  // Stores the selected rows unique-ids in the _savedMarkedIds property of
  // the table element
  function _initServer() {
    var uid = this.options.uniqueId
    var ids = this.getAllSelections().map(function (r) { return r[uid] })

    if (ids.length) this.$el[0]._savedMarkedIds = ids

    this._bst_initServer.apply(this, arguments)
  }

  var proto = $.fn.bootstrapTable.Constructor.prototype
  var _init = proto.init

  proto.init = function () {

    _init.apply(this, Array.prototype.slice.apply(arguments))

    if (this.options.uniqueId && this.options.maintainSelected) {
      this._bst_initServer = this.initServer
      this.initServer = _initServer
      this._bst_initData = this.initData
      this.initData = _initData
      this.$el.on('load-error.bs.table', _removeIds)
    }
  }

})(jQuery)
