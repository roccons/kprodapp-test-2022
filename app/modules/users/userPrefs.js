'use strict'

const userPrefsTmpl = require('./views/userPrefs.pug')
const environ  = require('scripts/services/environment')

module.exports = function userPref() {
  const DLG_ID = '#user-prefs'
  const prefEnv = environ.getEnviron()
  const menuInit = App.config.ls('menu-fold') || ''

  const ctx = {
    menuInit,
    prefEnv,
    prefURL: environ.customURL(),
  }

  $(document.body).append(userPrefsTmpl(ctx))

  const $dlg = $(DLG_ID)
    .on('hidden.bs.modal', function () {
      $(this).remove()
    })
    .modal({
      backdrop: 'static'
    })
    .submit(false)

  const form = $dlg.find('form').get(0)

  $(form.user_prefs_menu).click(function () {
    App.config.ls('menu-fold', this.value)
  })

  $(form.user_prefs_env).click(function () {
    const url = this.form.user_prefs_url
    environ.saveEnv(this.value, url.value)
    url.disabled = this.value !== 'CUSTOM'
    if (!url.disabled) url.focus()
  })

  $(form.user_prefs_url).change(function () {
    environ.saveEnv('CUSTOM', this.value)
  })

  $('#user-prefs-tables').click(function () {
    const rt = App.config.rt
    const ls = App.config.ls

    ls.each(function (key) {
      if (/:(?:cols|pageSize)$/.test(key)) ls.remove(key)
    })
    rt.each(function (key) {
      if (/:(?:sortName|sortOrder|pageSize)$/.test(key)) rt.remove(key)
    })

    App.ui.toast.info('Preferencias de tabla eliminadas')
    $(this).prop('disabled', true)
  })
}
