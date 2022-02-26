
function setReadOnlyForm(form) {
  $(form)
    .addClass('-readonly')
    .find('input,textarea,select,button,fieldset')
    .each(function () {
      switch (this.nodeName) {
        case 'INPUT':
        case 'TEXTAREA':
          if (this.type !== 'hidden') {
            this.setAttribute('readonly', '')
          }
          break
        default:
          this.classList.add('disabled')
          this.disabled = true
          break
      }
      this.classList.add('-lockstate')
    })
}

function checkShow(form, caps) {
  const ctls = form.querySelectorAll('[data-show-require]')

  for (let i = 0; i < ctls.length; i++) {
    const elem = ctls[i]
    const name = elem.getAttribute('data-show-require')

    if (!caps[name]) {
      $(elem).remove()
    }
  }
}

function checkReadOnly(form, caps) {
  const ctls = form.querySelectorAll('[data-write-require]')

  for (let i = 0; i < ctls.length; i++) {
    const elem = ctls[i]
    const name = elem.getAttribute('data-write-require')

    if (!caps[name]) {
      $(elem).off().attr('readonly', '').addClass('-lockstate')
    }
  }
}

function checkActions(form, caps) {
  const ctls = form.querySelectorAll('[data-action-require]')

  for (let i = 0; i < ctls.length; i++) {
    const elem = ctls[i]
    const name = elem.getAttribute('data-action-require')

    if (!caps[name]) {
      if (elem.nodeName === 'BUTTON') {
        if (!caps['change-ask']) {
          $(elem).off().prop('disabled', true).addClass('-lockstate')
        }
      } else if (elem.nodeName === 'LI') {
        $(elem).off().addClass('disabled -lockstate')
      } else if (elem.nodeName === 'A') {
        $(elem).off().addClass('disabled -lockstate').removeAttr('href')
      } else {
        $(elem).off().addClass('hide').addClass('-lockstate')
      }
    }
  }
}

module.exports = function formAccess(form, ctx, lock) {
  const caps = ctx.user_capabilities

  if (!lock) {
    const name = form.getAttribute('data-edit-require')
    lock = name && !caps[name]
  }

  if (lock) {
    setReadOnlyForm(form)
    checkShow(form, caps)
    checkActions(form, caps)
    return false
  }

  checkShow(form, caps)
  checkActions(form, caps)
  checkReadOnly(form, caps)
  return true
}
