/*
  El usuario podrá asociar un insumo que se está creando,
  editando o viendo a un recurso existente
 */

function setFocus() {
  const el = this.querySelector('form input[name^="f_"]')
  if (el) el.focus()
}

function clearForm() {
  const setValue = require('scripts/lib/set-value')
  const $form = $(this).closest('form')

  $form.find('[name^="f_"]').each(function () {
    if (hasClass(this, 'has-tokens')) $(this).tokenfield('setTokens', [])
    else setValue(this, '')
  })

  $form.find('[name^="easy_f_"]').each(function () {
    $(this).val('')
  })

  checkForm.call($form.get(0))
}

function checkForm() {
  const readForm = require('scripts/read-form')
  const form  = this  // eslint-disable-line consistent-this
  const data  = readForm(form, 'f_', true)
  const empty = !data
  //$(form).find('.clean-filters').prop('disabled', empty)
  $(form).find('.submit-form').prop('disabled', empty)
  $(form).find('.cancel-form').prop('disabled', empty)
}

function nullIfEmpty(data) {
  if (data) {
    for (const p in data) {
      if (data.hasOwnProperty(p)) return data
    }
  }
  return null
}


// ---------------------------------------------------------------------------
// The filter Class
// ---------------------------------------------------------------------------

class AdvFilter {

  constructor(options) {

    this.options    = options
    this.tableId    = `#${options.prefix}Table`
    this.memoryKey  = `${options.prefix}-adv-search`
    this.data       = $.configs.get(this.memoryKey)

    this.search = this.search.bind(this)

    this.additionalFields = []
  }

  getSearchInput() {
    return $(this.tableId).closest('.bootstrap-table').find('.search>input')
  }

  showState(data) {
    const hasFilter = !!data
    $('#adv-search-btn').find('i').toggleClass('text-primary', hasFilter)
    this.getSearchInput().prop('disabled', hasFilter).attr('placeholder', hasFilter ? '' : 'Buscar')
  }

  setData(data) {
    this.data = data = nullIfEmpty(data)
    if (this.data && this.data.process_type !== null) {
      this.data.process_type = this.additionalFields ? this.additionalFields[0].val() : null
    }
    $.configs.set(this.memoryKey, data)
    return data
  }

  refreshTable(e, data) {
    if (data) {
      App.config.rt(`${this.options.prefix}:search`, '') // bstable search value
      this.getSearchInput().val('')
    } else {
      data = null
    }
    this.showState(data)
    $(e.currentTarget.form).closest('.modal').modal('close')
    $(this.tableId).bootstrapTable('refresh')
  }

  // Send the filter request through refreshTable
  submitSearch(e) {
    e.preventDefault()

    const readForm = require('scripts/read-form')
    const form = e.target.form
    const data = Object.assign(readForm(form, 'f_', true), readForm(form, 'easy_f_', true))

    this.refreshTable(e, this.setData(data))
  }

  removeFilter(e) {
    this.refreshTable(e, this.setData())  // clear memory and refresh
  }

  search() {
    const createModal = require('scripts/create-modal')
    const data = this.data || {}
    $.hideTooltips()

    // Initialize Modal
    const $form = createModal(null, this.options.tmplFn({ data }))
      .on('shown.bs.modal', setFocus)
      .modal()
      .find('form').submit(false)

    $form.find('.clean-filters').click($.proxy(this.removeFilter, this))
    $form.find('.submit-form').click($.proxy(this.submitSearch, this))
    $form.find('.cancel-form').click(clearForm)
    this.initForm($form)
  }

  initForm($form) {
    const setProductionKeys = require('scripts/set-production-keys')

    $form.find('.has-tokens').tokenfield()
    setProductionKeys('#as-production_key').addClass('has-tokens')
    $form.find('.has-integer').onlyDigits()

    $form
      .on('clean.areYouSure', checkForm)
      .on('dirty.areYouSure', checkForm)
      .areYouSure({
        silent: true
      })
    $form.on('change', checkForm)
    this.additionalFields = [
      $('#as-process_type').easySelect()
    ]
    checkForm.call($form.get(0))
  }

  getData() {
    if (this.data && this.data.process_type) {
      this.data.process_type = this.additionalFields ? this.additionalFields[0].val() : null
    }

    if (this.data && this.data.script) {
      // eslint-disable-next-line
      this.data.script = this.data.script.replace(/(^\w+:|^)\/\//, '');
    }

    return this.data
  }

  hasData() {
    return !!nullIfEmpty(this.data)
  }

}

module.exports = AdvFilter
