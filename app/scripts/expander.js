
module.exports = function expander(e) {
  'use strict'

  if (e.isDefaultPrevented() || !hasClass(e.target, 'expander')) {
    return
  }
  e.preventDefault()

  const $box = $(this)
  const elem = hasClass(this, 'inside') ? this : this.parentNode
  const $exp = $(elem.querySelector('.expandible'))

  if ($box.toggleClass('expanded').hasClass('expanded')) {
    $exp.slideDown('fast')
  } else {
    $exp.slideUp('fast')
  }
}
