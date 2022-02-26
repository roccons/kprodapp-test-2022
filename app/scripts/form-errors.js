module.exports = function formErrors(el, message, title) {

  if (message === null) {
    $(el).empty()
    return
  }

  scrollTo(0, 0)

  if (Array.isArray(message)) message = message.join('<br>')

  const view = require('views/form-errors.pug')
  const $dlg = $(view({ title, message }))
  const $el  = $(el).css('display', 'none')

  $dlg.find('a[data-link]').addClass('alert-link')
  $dlg.appendTo($el.empty()).alert()
  $el.slideDown()

  if (!$el.hasClass('initialized')) {
    $el.on('click', '.alert-link', goToField).addClass('initialized')
  }

  function goToField() {
    const $self = $(this)
    const form  = $self.closest('form').get(0)
    const fname = $self.data('link')

    if (form && fname) {
      const part = /^([^[]+)\.(\d+)$/.exec(fname)
      const elem = part ? form[part[1]][~~part[2]] : form[fname]
      if (elem) {
        if (hasClass(elem, 'has-tokens')) $(elem).tokenfield('getInput').focus()
        else if (elem.focus) elem.focus()
        else if (elem.scrollIntoView) elem.scrollIntoView()
      }
    }
  }
}
