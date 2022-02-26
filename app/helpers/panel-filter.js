/*
  Rutinas para filtros en el Panel de órdenes implementadas como clase.

  Cada cambio actualiza la tabla con refresh() y los parámetros Ajax,
  que están interceptados, agregan el filtro.

  Todos los valores son memorizados como arrays, excepto los que se
  muestran con SELECTs, que son memorizados por su valor unitario.

*/

const RE_ISODATE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/

function clearMarkup() {
  $('#filters-sidebar-wrapper').remove()
  $('#filter-unhide').remove()
}

function colorize(el) {
  if (el.target && el.target.tagName) {
    el = $(el.target).closest('.form-group')
  }

  // easySelect mirrors the select as an input
  $(el).find('input').each((_, f) => {
    const box = $(f.parentNode).closest('.form-group')[0]
    if (box) {
      let val = ''
      if (hasClass(box, 'input-daterange')) {
        $(box).find('input').each(function () { if (this.value) val = '1' })
      } else {
        val = this.data[f.name]
      }
      box.classList.toggle('has-value', Array.isArray(val) ? !!val.length : !!val)
    }
  })
}

// Forma eficiente de comprobar si el objeto está vacío y devolver null en ese caso.
function nullIfEmpty(obj) {
  if (obj) {
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) return obj
    }
  }
  return null
}


class Filter {

  constructor(options) {

    this.openClass = 'filters-sidebar-open'
    this.container = '#main-wrapper'
    this.options = assign(
      {
        easySelect: { size: 6 },
        datepicker: { format: 'd/M/yyyy', clearBtn: true, enableOnReadonly: true }
      },
      options
    )

    this.memoryKey = this.memoryKey || `${document.section.slice(0, 6)}-filters`

    // con el manejo de mensaje desde los páneles, quizá esto no se nececita
    this.queryParams = qp => {
      const filters = this.filterData()
      if (filters) {
        qp.filters = JSON.stringify(filters)
      }
      return qp
    }

    if (this.onChange) {
      this.refreshFn = App.debounce(() => {
        this.onChange(this.filterData())
      }, 200)
    } else {
      this.refreshFn = App.debounce(() => {
        $(this.options.tableKey).bootstrapTable('refresh')
      }, 200)
    }

    // agiliza aquí un poco la carga de los catálogos dinámicos
    this._source = App.server('/dynamicCatalogs')

    // showMarkup hace uso de los catálogos devueltos en _source
    this.showMarkup = () => {
      return this._source
        .done(res => {
          // Usamos App como caché de los catálogos dinámicos
          this.catalogs = res
          this._showMarkup(res)
        })
        .fail(xhr => { App.ui.toast.error(`Error leyendo datos de filtros: ${App.server.errStr(xhr)}`) })
    }

    this.colorize = colorize.bind(this)

    this.init()
  }


  init() {
    const conf = this.restoreMemory()

    this.reset()

    if (conf) {
      const flds = [
        'assigned_editor', 'requested_by', 'responsible',
        'resource_type_group', 'resource_type', 'resource_version'
      ]
      const data = this.data

      Object.keys(conf).forEach(k => {
        if (data.hasOwnProperty(k)) {
          let value = conf[k]

          if (~flds.indexOf(k)) {
            if (!value) value = []
            else if (!Array.isArray(value)) value = [value]
          } else if (RE_ISODATE.test(value)) {
            value = new Date(value.replace(' ', 'T'))
          }
          data[k] = value
        }
      })
    }

    // Se asegura de que el sidebar de filtros no existe
    // IMPORTANTE que esté aquí, antes de cualquier llamada a showMarkup
    clearMarkup()

    // Coloca un objeto en el store con el único propósito de monitorizar
    // mensajes de cierre del panel de filtros.
    // Este objeto será eliminado automáticamente por la App al cambiar la
    // ruta, pero antes lanzará el CLOSE_FILTERS.
    const closeThis = () => {
      const container = getById(this.container)
      if (container) {
        container.classList.remove(this.openClass)
      }
    }

    App.store.add('filters-sidebar')
      .on(App.EVT.CLOSE_FILTERS, closeThis)
      .destroy = closeThis
  }


  reset() {
    this.data = {
      process_type: [],
      is_translation: [],
      cicle: [],
      country: [],
      classification: [],
      grade: [],
      challenge: [],
      pathway: [],
      language: [],
      session: [],
      is_extra_reto: [],
      assigned_editor: [],
      requested_by: [],
      responsible: [],
      reviewed_by: [],
      resource_type_group: [],
      resource_type: [],
      resource_version: [],
      status: [],
      card_substatus: [],
      been_published: [],
      card_status_updated_at: [],
      production_id: [],
      assigned_user: [],
      challenge_closure: [],
      priority: [],
      attrs_additional: [],
      is_classified: []
    }
    if (App.user.has('EDITOR')) {
      this.data.assigned_editor.push(App.user.id)
    }
  }


  saveMemory(data) {
    if (data) {
      App.config.rt(this.memoryKey, data)
    } else {
      App.config.rt.remove(this.memoryKey)
    }
  }

  restoreMemory() {
    const data = App.config.rt(this.memoryKey)
    return data
  }


  clearFilter() {
    const form = this.getForm()
    this.reset()

    Object.keys(this.data).forEach(k => {
      const ff = form[k]
      if (!ff) {
        return
      }
      if (ff.easySelect) {
        ff.easySelect().setValue('')
      } else if (hasClass(ff, 'filter-date')) {
        $(ff).datepicker('clearDates')
      } else if (hasClass(ff, 'is-string')) {
        ff.value = ''
      } else {
        const checks = ff.length ? ff : [ff]
        for (let i = 0; i < checks.length; i++) {
          checks[i].checked = false
        }
      }
    })

    //this.refreshFn()
  }


  cleanSelect(jqev) {
    const grp = $(jqev.target).closest('.form-group').get(0)
    const fld = grp && grp.querySelector('input.es-input')
    if (fld && fld.easySelect) fld.easySelect().unselectAll()
  }


  selectAll(e) {
    const select = e.currentTarget.parentNode.querySelector('select')
    if (select) {
      const opt = e.target
      if (hasClass(opt, 's1')) {
        select.easySelect().selectAll()
      } else if (hasClass(opt, 's2')) {
        Array.prototype.forEach.call(select.options, o => { o.selected = !o.selected })
        select.easySelect().resync()
      }
      this.colorize(e.currentTarget.parentNode)
    }
  }


  /**
   * Si el "group" está en blanco, el "type" muestra todo, si el "type" está en blanco,
   * "version" muestra todo. Se intenta mantener los valores de los selects.
   *
   * @param  {object} jqev     - Evento jQuery
   * @param  {Array} [arrType] - Array con los valores seleccionados de resource_type
   * @param  {Array} [arrVer]  - Array con los valores seleccionados de resource_version
   */
  resetSelects(jqev, arrType, arrVer) {
    const nameFromId = App.catalogs.nameFromId
    const root   = jqev.target
    const form   = root.form
    const groups = root.easySelect().getSelValues().map(Number)

    let types = (Array.isArray(arrType) ? arrType : form.resource_type.easySelect().getSelValues()).map(Number)
    let tCat = App.catalogs.get('resource_types')
    let vCat = App.catalogs.get('resource_versions')
    let opts, names

    if (root.name === 'resource_type_group') {
      names = {}
      opts = {}
      if (groups.length) {
        tCat = tCat.filter(c => groups.indexOf(c.resource_type_group_id) > -1)
      }
      tCat.forEach(c => {
        let name = names[c.resource_type_group_id]
        if (!name) {                // si el tipo aun no tiene grupo...
          names[c.resource_type_group_id] = name = nameFromId('resource_type_groups', c.resource_type_group_id)
          opts[name] = []
        }
        opts[name].push({ text: c.name, value: c.id, selected: types.indexOf(c.id) > -1 })
      })
      types = form.resource_type.easySelect().setOptions(opts).getSelValues().map(Number)
    }

    // resource_version
    const vers = (Array.isArray(arrVer) ? arrVer : form.resource_version.easySelect().getSelValues()).map(Number)
    names = {}
    opts = {}
    if (types.length) {
      // hay tipos seleccionados, solo mostrar versiones de esos tipos
      vCat = vCat.filter(c => types.indexOf(c.resource_type_id) > -1)
    } else if (groups.length) {
      // no hay tipos pero hay grupos, los tipos de esos grupos están ya filtrados en tCat
      tCat = tCat.map(c => c.id)
      vCat = vCat.filter(c => tCat.indexOf(c.resource_type_id) > -1)
    }
    vCat.forEach(c => {
      let name = names[c.resource_type_id]
      if (!name) {
        names[c.resource_type_id] = name = nameFromId('resource_types', c.resource_type_id)
        opts[name] = []
      }
      opts[name].push({ text: c.name, value: c.id, selected: vers.indexOf(c.id) > -1 })
    })
    form.resource_version.easySelect().setOptions(opts)
  }


  /**
   * Alterna el estado de apertura del sidebar de filtros.
   */
  toggleFilter() {
    const container = getById(this.container)
    if (container) {
      container.classList.toggle(this.openClass)
    }
  }


  _showMarkup(cats) {
    const options = this.options

    let view = options.template
    if (typeof view == 'string') {
      view = require(view)
    }

    const $container = $(this.container)
    const statuses = options.statuses_source && App.catalogs.get(options.statuses_source)
    const productions = App.catalogs.get('production')
    $container.append(view({
      cats,
      statuses,
      productions,
      data: this.data,
    }))

    $container.find('.toggle-filters').click(this.toggleFilter.bind(this))
    $container.find('.apply-filters').click(this.refreshFn).dblclick(false)
    $container.find('.clean-filters').click(this.clearFilter.bind(this))

    const form  = this.getForm()
    const $form = $(form)

    $form.find('select').easySelect(options.easySelect)
    this.resetSelects(
      { target: form.resource_type_group }, this.data.resource_type, this.data.resource_version)

    // resetSelects llama a refreshFn indirectamente, pero hay un debounce
    $(form.resource_type_group).change(this.resetSelects)
    $(form.resource_type).change(this.resetSelects)

    $form.find('.input-daterange')
      .datepicker(options.datepicker)
      .find('input').addClass('filter-date')

    $form.change(this.getData.bind(this))

    $form.on('click', 'label.expander', require('scripts/expander'))
    $form.on('click', 'label>.cleaner', this.cleanSelect)

    $form.find('.select-opts').click(this.selectAll.bind(this))

    App.one(App.EVT.PAGE_CLEARED, clearMarkup)

    setImmediate(this.colorize, form)
  }


  // Devuelve el form de los filtros
  get formId() {
    return 'filters-sidebar-form'
  }

  getForm() {
    return getById(this.formId)
  }


  getData() {
    const form = this.getForm()
    const data = this.data
    const req  = {}

    // Lee los datos del FORM que coinciden con las propiedades en this.data
    if (form) {
      Object.keys(data).forEach((k) => {
        const ff = form[k]
        let value
        if (!ff || typeof ff != 'object' || ff.type === 'button') return

        if (ff.easySelect) {
          if (ff.multiple) {
            value = ff.easySelect().getSelValues()
          } else {
            value = ff.easySelect().getValue()
          }
        } else if (hasClass(ff, 'filter-date')) {
          value = $(ff).datepicker('getDate')
          if (value) req[k] = value

        } else if (typeof data[k] == 'number') {
          value = ff.checked ? ~~ff.value : 0
        } else if (hasClass(ff, 'is-string')) {
          value = ff.value.replace(/\s+/g, ' ').trim()
        } else {
          const checks = ff.length ? ff : [ff]
          value = []
          for (let i = 0; i < checks.length; i++) {
            if (checks[i].checked) {
              value.push(checks[i].value)
            }
          }
        }

        data[k] = value
      })
    }

    Object.keys(data).forEach(k => {
      const value = data[k]
      if (value) {
        if (!Array.isArray(value) || value.length) {
          req[k] = value
        } else if (k === 'assigned') req[k] = 1
      }
    })

    this.data = data

    if (form) setImmediate(this.colorize, form)

    return req
  }


  filterData() {
    const req = nullIfEmpty(this.getData())
    this.saveMemory(req)
    return req
  }
}

module.exports = Filter
