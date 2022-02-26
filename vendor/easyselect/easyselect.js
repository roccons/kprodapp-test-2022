/*!
 * jquery.easySelect - v1.0.0
 * 2016-06-06
 */
(function ($) {
  'use strict'
  /* eslint consistent-this:0, complexity:0 */

  var _uid = 0

  var CAPT = '<input type="text" placeholder="{p}" class="es-input" tabindex="{t}">'

  'use strict'

  function _change(el) {
    if (!el) return
    var name = 'change'

    if (typeof el.dispatchEvent == 'function') {
      var event = document.createEvent('HTMLEvents')
      event.initEvent(name, true, true)
      event.eventName = name
      try {
        el.dispatchEvent(event)
      } catch (e) {
        console.log('Error with ' + typeof el)
        console.error(e)
      }

    } else if (typeof el.fireEvent == 'function') {
      el.fireEvent('on' + name)
    }
  }

  // loops non-undefined elements of an array-like object
  function _each(lst, cb) {
    if (!lst) lst = []
    for (var i = 0; i < lst.length; i++) {
      if (lst[i] !== undefined && cb(lst[i], i) === false) break
    }
    return lst
  }

  function _click(e) {
    $(document).trigger('outclick.easySelect', e.target)
  }

  $.fn.easySelect = function (options) {

    // This is the easiest way to have default options.
    var settings = $.extend({
      placeholder: '',
      maxDisplayCount: 3,             // display no. of items in multiselect. 0 to display all.
      captionFormat: '{0} seleccionados',  // format of caption text. you can set your locale.
      forceCustomSelect: false,       // force the custom modal on all devices below floatWidth resolution.
      //nativeOnDevice: ['Android', 'BlackBerry', 'iPhone', 'iPad', 'iPod', 'Opera Mini', 'IEMobile', 'Silk'],
      nativeOnDevice: [],
      separator: ', ',                // separator for the list of selected items
      alignRight: false,
      search: false,                  // to display matching element.
      searchText: '',                 // current search text
      searchTime: 0,
      searchTimeOut: 500,
      classes: '',                    // class list to add to the easySelect box
      checkIcon: 'fa-check',
      size: 0,
      withKeys: false,
      up: false                       // set true to open upside.
    }, options)

    return this.each(function () {
      var selEl = this                          // the original select object
      if (selEl.easySelect || selEl.tagName !== 'SELECT') {
        return                                  // already initialized
      }
      var data = $(selEl).data()

      var easySelect = {
        $el: $(selEl),
        separator: settings.separator,
        checkIcon: settings.checkIcon,
        multiple: !!selEl.multiple,
        selectBox: null,
        optionBox: null,
        inputBox: null,
        isOpened: false,
        isNative: false,                        // use native select
        searchText: '',

        _createEasy: function () {
          var that = this
          var $el  = that.$el
          var data = $el.data()

          if (data.separator) this.separator = data.separator
          if (data.checkIcon) this.checkIcon = data.checkIcon

          var placeholder = data.placeholder || settings.placeholder || ''
          var classes     = data.classes     || settings.classes
          var alignRight  = data.alignRight  || settings.alignRight

          that.maxDisplayCount = ~~data.maxDisplayCount || settings.maxDisplayCount

          that.tabIndex = $el.attr('tabindex') | 0
          that.size = ~~(data.size || $el.attr('size') || settings.size)

          $el.wrap('<div class="easy-select">')
          var selectBox = that.selectBox = $el.parent()
          var inputBox  = that.inputBox  = $(CAPT.replace('{p}', placeholder).replace('{t}', that.tabIndex))
          var optionBox = that.optionBox = $('<ul class="options" tabindex="-1">')

          // makes easySelect accesible by the user
          selEl.easySelect = inputBox.get(0).easySelect = function () { return that }

          if (alignRight) selectBox.addClass('align-right')
          if (classes) selectBox.addClass(classes)
          if (selEl.className) inputBox.addClass(selEl.className)

          if ($el.attr('disabled')) {
            selectBox.addClass('disabled')
            inputBox.prop('disabled', true)
          }

          // show values
          that._setText()
          selectBox.append(inputBox).append('<span class="caret">')

          // break for mobile rendering... if forceCustomSelect is false
          if (!settings.forceCustomSelect && that._isMobile()) {
            that._setNative()
            return
          }

          // hide original select
          $el.addClass('es-hidden').attr('tabindex', -1)

          // copy another attributes
          if (selEl.id) {
            var sid = selEl.id
            $el.attr('id', 'easy_' + sid)
            inputBox.attr('id', sid)
          }
          if (selEl.name) {
            var name = selEl.name
            $el.attr('name', 'easy_' + name)
            inputBox.attr('name', name)
          }
          if (selEl.required) {
            inputBox.prop('required', true)
            $el.removeAttr('required').prop('required', false)
          }

          // check the clearbox in IE
          inputBox.on('input', that._checkInput)
          if (that.multiple) inputBox.prop('multiple', true)

          // create the list with any up or multiple options
          var $div = $('<div style="z-index:1001" class="es-wrapper' +
            (settings.up ? ' up' : '') + (that.multiple ? ' multiple' : '') + '">')

          // creating the markup for the available options
          $div.append(optionBox)

          // insert the options from the source
          optionBox.append(that._createItems(selEl.children))

          // adds the wrapper to the main box
          selectBox.append($div)

          // set the event handlers and we are done
          that._handleEvents()
        },

        _createItems: function (opts, disab) {
          var list = []
          var that = this

          _each(opts, function (opt) {       // parsing options to li
            var $opt = $(opt)
            var odis = opt.disabled

            list.push($opt.is('optgroup')
              ? $('<li class="group' + (odis ? ' disabled' : '') + '"><label>' + $opt.attr('label') + '</label><ul></ul></li>')
                .find('ul')
                .append(that._createItems($opt.children(), odis))
                .end()
              : that._createLI(opt, disab)
            )
          })
          return list
        },

        // Creates a LI element from a given option and binds events to it
        _createLI: function (opt, disab) {
          var that = this

          if (!opt.value) opt.value = opt.text
          opt._uid = ++_uid

          var li = opt.className ? ' ' + opt.className : ''
          if (disab || opt.disabled) li += ' disabled'
          if (opt.selected) li += ' selected'

          li = '<li class="opt' + li + '" data-uid="' + opt._uid + '">'
          if (that.multiple) li += '<i class="' + that.checkIcon + '"></i>'
          li = $(li + '<label>' + opt.text + '</label></li>')

          // set the click handler for this item
          li.click(function () {
            var $li = $(this)

            if ($li.hasClass('disabled')) return

            that.optionBox.find('.active').removeClass('active')
            $li.addClass('active')

            if (that.multiple) {
              $li.toggleClass('selected')
            } else {
              that.optionBox.find('.selected').removeClass('selected')
              $li.addClass('selected')
            }
            that._syncOpt($li)
            if (!that.multiple) that._hideBox(true)  // if its not a multiselect then hide on single select.
          })

          return li
        },

        // search module (can be removed if not required.)
        _searchOpt: function (c, tm) {
          if (tm !== tm) tm = Date.now()  // eslint-disable-line
          var that = this
          var time = tm - that.searchTime
          var text = String.fromCharCode(c).toLowerCase()

          that.searchTime = tm
          if (time < that.searchTimeOut) text = that.searchText += text
          else that.searchText = text

          var len = text.length
          var opt = null

          _each(selEl.options, function (o) { // eslint-disable-line consistent-return
            if (!o.disabled && o.text.slice(0, len).toLowerCase() === text) {
              opt = o
              return false
            }
          })
          return opt
        },

        _setSize: function () {
          var that = this
          var opts = that.optionBox.find('li')
          var size = that.size

          if (!opts.length) return false

          if (!size || size > opts.length) size = opts.length

          var scrn = $(window).height()
          var opht = opts.first().outerHeight()

          if (opht === 0) {
            opht = parseFloat(window.getComputedStyle(opts[0]).lineHeight)
            opht = opht ? 10 + opht : 27
          }

          if (size * opht + 2 > scrn) size = (scrn - 2) / opht | 0

          that.optionBox.get(0).style.maxHeight = opts.length > size ? size * opht + 'px' : ''
          return true
        },

        _showBox: function (key) {
          var that = this

          if (that.selectBox.hasClass('disabled')) return // if select is disabled then retrun

          if (!that._setSize()) return

          that.isOpened = true
          that.withKeys = !!key
          if (key) that.optionBox.addClass('es-keys')

          document.body.addEventListener('click', _click, true)

          that.optionBox.find('li.opt').each(function (ix) {
            var $li = $(this)
            var opt = selEl.options[ix]
            if (!opt) $li.remove()
            else {
              $li.toggleClass('disabled', opt.disabled)
              $li.toggleClass('selected', opt.selected)
            }
          })

          //that.selectBox.on('keydown.easySelect', that._onListKey).addClass('open')
          that.selectBox.addClass('open')
          that.selectBox.find('>.es-wrapper').slideDown('fast')

          that.optionBox.on('keydown.easySelect', that._onListKey)
          that.inputBox.addClass('focus')
          that.optionBox.parent().css('top', that.inputBox.outerHeight())
          that.optionBox.focus()
          that.optionBox.find('li.opt:not(.disabled)').first().addClass('active')

          // hide optionBox on click outside.
          $(document).on('outclick.easySelect', function (e, elem) {
            var that = selEl.easySelect()
            //var elem = e.data()
            if (!that.selectBox.is(elem) && !that.selectBox.has(elem).length) that._hideBox()
          })
        },

        _hideBox: function (same) {
          var that = this

          if (that.isOpened) {
            document.body.removeEventListener('click', _click, true)
            $(document).off('outclick.easySelect')
            that.isOpened = that.withKeys = false
            that.selectBox.removeClass('open').find('>.es-wrapper').css('display', 'none') //slideUp(80)
            that.optionBox.off('keydown.easySelect', that._onListKey).removeClass('es-keys')
            that.optionBox.find('li.active').removeClass('active')
            that.inputBox.removeClass('.focus')
            that.searchText = ''    // clear the search
            if (same) that.inputBox.focus()
            else that.inputBox.removeClass('focus')
          }
        },

        _toggleBox: function (v) {
          if (this.isOpened) this._hideBox(v)
          else this._showBox(v)
        },

        _navOpt: function (up, top) {
          var that = this
          var opts = selEl.options
          var uid, i, o, opt

          if (!opts || !opts.length) return null

          if (that.isOpened) uid = that.optionBox.find('.active').attr('data-uid')
          else uid = opts[Math.max(selEl.selectedIndex, 0)]._uid

          if (uid) uid |= 0
          else top = true

          if (up) {
            for (i = 0; i < opts.length; i++) {
              o = opts[i]
              if (top && !o.disabled) return o
              if (uid === o._uid) break
              if (!o.disabled) opt = o
            }
          } else {
            i = opts.length
            while (--i >= 0) {
              o = opts[i]
              if (top && !o.disabled) return o
              if (uid === o._uid) break
              if (!o.disabled) opt = o
            }
          }
          return opt ? opt : o && !o.disabled ? o : false
        },

        _onInputClick: function (e) {
          var that = selEl.easySelect()
          e.preventDefault()
          e.stopPropagation()
          that._toggleBox(that.isOpened) // send true only if is open
        },

        _onInputKey: function (e) {
          var that = selEl.easySelect()
          var c = e.which

          //console.log('which: ' + c + ', keyCode: ' + e.keyCode)
          if (that.isOpened) {
            that.optionBox.focus()
            that._onListKey(e)
            return
          }

          // enter, shift-enter, or alt+up or alt+down toggles the popup
          if (e.altKey ? c === 38 || c === 40 : c === 13 && !e.ctrlKey) {
            e.preventDefault()
            e.stopPropagation()
            that._showBox(true)

          } else if (c === 8 || c === 46 || c === 127) {
            e.preventDefault()
            e.stopPropagation()
            if (that.multiline) that._setSelAll(false)
            else if (selEl.length && !selEl[0].value) that._setSel(true, 0)

          } else {
            // pass movement keys (tab, shift-tab)
            var opt = 0
            if (!that.multiple) {
              switch (c) {
                case 36:  //home
                  opt = that._navOpt(true, true)       // first item
                  break
                case 35:  //end
                  opt = that._navOpt(false, true)      // last item
                  break
                case 38:  //up
                  opt = that._navOpt(true)             // prev item
                  break
                case 40:  //dn
                  opt = that._navOpt(false)            // next item
                  break
                default:
                  break
              }
            }
            if (c >= 46 || c === 32 || c === 8 || opt) {
              e.preventDefault()
              e.stopPropagation()
              if (c >= 46 && !that.multiline) opt = that._searchOpt(c, e.timeStamp | 0)
              if (opt) that._syncSelLI(opt, true)
            }
          }
        },

        _checkInput: function (e) {
          if (!e.target.value) selEl.selectedIndex = -1
        },

        _nav: function (opt) {
          var that = this
          var $lis = that.optionBox
          var $opt = $lis.find('li[data-uid=' + opt._uid + ']')

          $lis.find('li.active').removeClass('active')
          if (!that.withKeys) {
            that.withKeys = true
            that.optionBox.addClass('es-keys')
          }
          $opt.addClass('active')

          // make the active item visible
          var st = $lis.scrollTop()
          var tp = $opt.position().top
          if (tp < 0) {
            $lis.scrollTop(st + tp)
          } else {
            var optB = $opt.outerHeight() + tp
            var lisB = $lis.height()
            tp = optB - lisB
            if (tp > 0) $lis.scrollTop(st + tp)
          }
        },

        _onListKey: function (e) {
          var that = selEl.easySelect()
          var opt
          var c = e.which

          switch (c) {
            case 38:    //up
              opt = that._navOpt(true)
              break
            case 36:    //home
              opt = that._navOpt(true, true)
              break

            case 40:    //down
              opt = that._navOpt(false)
              break
            case 35:    //end
              opt = that._navOpt(false, true)
              break

            case 32:    //space
            case 13:    //enter
              opt = that.optionBox.find('li.active')
              if (that.withKeys) {
                opt.click()
                opt = 0
              } else {
                opt = opt.length ? opt.get(0) : that._navOpt(true, true)
              }
              break

            case 9:	    //tab
            case 27:    //esc
              that._hideBox(true)
              break

            default:
              if (c < 46) return  //no preventDefault()
              opt = that._searchOpt(c, e.timeStamp | 0)
              break
          }
          e.preventDefault()

          if (opt) that._nav(opt)
        },

        _handleEvents: function () {
          var that = this

          that.inputBox
              .keydown(that._onInputKey).click(that._onInputClick)
              .on('focus', function () {
                var ff = this
                if (ff.value.length) {
                  if (ff.selectionStart != null) {
                    ff.selectionStart = ff.selectionEnd = ff.value.length
                  } else if (ff.createTextRange) {
                    var fr = ff.createTextRange()
                    fr.moveStart('character', ff.value.length)
                    fr.collapse()
                    fr.select()
                  }
                }
                $(this).addClass('focus')
              })
              .on('blur', function () {
                if (!that.isOpened) {
                  $(this).removeClass('focus')
                }
              })
          that.selectBox.find('.caret').click(that._onInputClick)
        },

        _setText: function (silent) {
          var that = this
          var olds = that.inputBox.val()
          var sels

          if (that.multiple) {
            sels = []
            _each(selEl.options, function (o) {
              if (o.selected) sels.push(o.text)
            })
            if (sels.length > that.maxDisplayCount) {
              sels = settings.captionFormat.replace(/\{0}/g, sels.length)
            } else {
              sels = sels.join(that.separator)
            }

          } else if (selEl.selectedIndex >= 0) {
            var opt = selEl[selEl.selectedIndex]
            sels = opt.text

          } else {
            sels = ''
          }

          // set display text
          if (olds !== sels) {
            that.inputBox.val(sels)
            if (!silent) _change(that.inputBox[0])
          }
        },

        _isMobile: function () {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = String(navigator.userAgent || navigator.vendor || window.opera).toLowerCase()

          // Checks for iOS, Android, Blackberry, Opera Mini, and Windows mobile devices
          for (var i = 0; i < settings.nativeOnDevice.length; i++) {
            if (ua.indexOf(settings.nativeOnDevice[i].toLowerCase()) > 0) {
              return settings.nativeOnDevice[i]
            }
          }
          return false
        },

        _setNative: function () {
          var that = this
          that.$el.addClass('es-hidden es-mobile')//.css('height', that.selectBox.outerHeight());
          that.isNative = true
          //that.$el.change(function () { that._setText() })
        },

        /*=== HELPERS FOR OUTSIDERS ===*/

        // Validates range of given item operations
        _check: function (i) {
          if (i < 0 || i >= selEl.length) throw new Error('index out of bounds')
          return this
        },

        _syncOpt: function ($li) {
          var that = this
          var uid  = $li.attr('data-uid') | 0

          _each(selEl.options, function (o) { // eslint-disable-line
            if (o._uid === uid) {
              var sel = $li.hasClass('selected')
              o.disabled = $li.hasClass('disabled')
              if (sel !== o.selected) {
                o.selected = sel
                if (sel && !that.multiple) selEl.selectedIndex = o.index
                that._setText()
                _change(selEl)
              }
              return false
            }
          })
        },

        _syncSelLI: function (opt, sel) {
          var that = this

          if (sel !== opt.selected && !(sel && opt.disabled)) {
            var $li = that.optionBox.find('li[data-uid=' + opt._uid + ']')

            if (!that.multiple) that.optionBox.find('li.selected').removeClass('selected')
            $li.toggleClass('disabled', opt.disabled).toggleClass('selected', opt.selected)
            opt.selected = sel
            that._setText()
            _change(selEl)
          }
        },

        // Set the selection of an element
        _setSel: function (sel, ix) {
          var that = this
          var opt

          if (typeof ix === 'number') {
            that._check(ix)
            opt = selEl[ix]
          } else {
            opt = selEl.querySelector('option[value="' + ix + '"]')
          }
          if (!opt || opt.disabled && sel) return that

          that._syncSelLI(opt, sel)
          return that
        },

        // Set the disabled state of an element
        _setDisab: function (dis, ix) {
          var that = this
          var opt

          if (typeof ix === 'number') {
            that._check(ix)
            opt = selEl[ix]
          } else {
            opt = selEl.querySelector('option[value="' + ix + '"]')
          }
          if (!opt || dis === opt.disabled) return that

          opt.disabled = dis
          if (dis && opt.selected) that._syncSelLI(opt, false)
          else that.optionBox.find('li[data-uid=' + opt._uid + ']').toggleClass('disabled', dis)

          return that
        },

        // Set the disable state of the whole control
        _setEasyDisab: function (dis) {
          var that = this
          var tdis = 'disabled'

          that.disabled = dis = !!dis
          that.selectBox.toggleClass(tdis, dis)
          that.$el.prop(tdis, dis)
          that.inputBox.prop(tdis, dis)
          return that
        },

        // Select or unselect all the options
        _setSelAll: function (sel, silent) {
          var that = this
          var upt

          _each(selEl.options, function (o) {
            if (sel && o.disabled) return
            if (sel !== o.selected) {
              o.selected = sel
              if (!that.isNative) that.optionBox.find('li').eq(o.index).toggleClass('selected', sel)
              upt = true
            }
          })
          if (!sel) selEl.selectedIndex = -1
          if (upt) {
            that._setText(silent)
            if (!silent) _change(selEl)
          }
          return that
        },

        // Select or unselect all the options
        _setSelValues: function (vals, silent) {
          var that = this
          var upt
          if (vals.length) vals = vals.map(String)

          _each(selEl.options, function (o) {
            var sel = vals.indexOf(o.value) > -1
            if (sel !== o.selected) {
              o.selected = sel
              if (!that.isNative) that.optionBox.find('li').eq(o.index).toggleClass('selected', sel)
              upt = true
            }
          })
          if (upt) {
            that._setText(silent)
            if (!silent) _change(selEl)
          }
          return that
        },

        _insertLI: function (opt, i) {
          var $li = this._createLI(opt)

          if (i < 0) this.optionBox.append($li)
          else this.optionBox.find('li.opt').eq(i).before($li)
        },

        /*=== PUBLIC METHODS ===*/

        // Outside accessibility options which can be accessed from the element instance
        resync: function () {
          var that = this
          var $lis = that.optionBox.find('li.opt')

          _each(selEl.options, function (o) {
            var $li = $lis.eq(o.index)
            $li.toggleClass('selected', o.selected).toggleClass('disabled', o.disabled)
          })
          that._setText()
          return that
        },

        reload: function () {
          var elm = this.unload()
          return $(elm).easySelect(settings)
        },

        unload: function () {
          var that = this
          that.inputBox.off()
          that.optionBox.off()
          that.selectBox.off().before(that.$el)
          //that.$el.show()
          that.selectBox.remove()
          delete that.inputBox.easySelect
          delete selEl.easySelect
          that.selectBox = that.inputBox = that.optionBox = false
          return selEl
        },

        // Adds a new option to the select at a given index
        add: function (val, txt, i) {
          if (val == null) throw new Error('No value to add')
          if (typeof txt == 'number') { i = txt; txt = val }
          if (txt == null) txt = val

          var that = this
          var opts = selEl.options

          if (i == null || i === opts.length) i = -1
          else if (i < -1 || i > opts.length) throw new Error('index out of bounds')

          var opt = new Option(txt, val)

          if (i === -1) selEl.add(opt)
          else selEl.add(opt, i)

          if (!that.isNative) that._insertLI(opt, i)

          return that
        },

        // Removes an item at a given index
        remove: function (i) {
          var self = this._check(i)
          selEl.remove(i)
          if (!self.isNative) self.optionBox.find('li.opt').eq(i).remove()
          self._setText()
        },

        setOptions: function (opts) {
          var self = this
          var sele = self.$el.get(0)
          sele.length = 0

          // can have optgroup
          while (sele.firstChild) sele.removeChild(sele.firstChild)

          function addOpts (_e, _opts) {
            _opts.forEach(function (o) {
              var opt = o.text !== undefined
                ? { text: o.text, value: o.value } : { text: o.name, value: o.id }
              opt = new Option(opt.text, opt.value == null ? opt.text : opt.value)
              _e.appendChild(opt)
              if (o.selected) opt.selected = true
            })
          }

          if (Array.isArray(opts)) {
            addOpts(sele, opts)
          } else {
            // Object.keys(opts) does not preserve order in Chrome
            Object.getOwnPropertyNames(opts).forEach(function (opt) {
              var e = document.createElement('optgroup')
              e.setAttribute('label', opt)
              addOpts(e, opts[opt])
              sele.appendChild(e)
            })
          }

          self.optionBox
            .empty()
            .html(self._createItems(sele.children))
          self._setText()

          return self
        },

        // Select an item at a given index
        selectItem: function (i) {
          return this._setSel(true, i)
        },

        // Unselect an iten at a given index
        unselectItem: function (i) {
          return this._setSel(false, i)
        },

        // Select all items
        selectAll: function (silent) {
          return this._setSelAll(true, silent)
        },

        // Unselect all items
        unselectAll: function (silent) {
          return this._setSelAll(false, silent)
        },

        // Disable an item at a given index
        disableItem: function (i) {
          return this._setDisab(true, i)
        },

        // Enables an item at a given index
        enableItem: function (i) {
          return this._setDisab(false, i)
        },

        //## New simple methods as getter and setter are not working fine in ie8-
        //## variable to check state of control if enabled or disabled.
        isEnabled: function () {
          return !this.$el.hasClass('disabled')
        },

        // Enables the control
        enable: function () {
          return this._setEasyDisab(false)
        },

        // Disables the control
        disable: function () {
          return this._setEasyDisab(true)
        },

        // Returns the selected value as a comma delimited list
        getValue: function () {
          var i, opts = selEl

          if (this.multiple) {
            var v = []
            for (i = 0; i < opts.length; i++) {
              if (opts[i].selected) v.push(opts[i].value)
            }
            return v.join(',')
          }

          return ~(i = opts.selectedIndex) ? opts[i].value : ''
        },

        // Set the selected values from a string
        setValue: function (val, silent) {
          return this._setSelValues([val], silent)
        },

        // Returns the selected values in an array
        getSelValues: function () {
          var arr = []
          _each(selEl.options, function (o) { if (o.selected && !o.disabled) arr.push(o.value) })
          return arr
        },

        // Set the selected values from an array
        setSelValues: function (vals, silent) {
          return this._setSelValues(Array.isArray(vals) ? vals : [vals], silent)
        },

        updateText: function () {
          this._setText(true)
          return this
        },

        getSourceElement: function () {
          return this.$el.get(0)
        },

        init: function () {
          this._createEasy()
          return this
        }
      }

      easySelect.init()
    })

  }

})(jQuery)
