
module.exports = function updateCount() {
  const hidden = $('#notifications-list').hasClass('readed-hidden')
  const $body  = $('#notifications-body')
  const count  = $body.children().length
  const unread = $body.children('.unread').length

  $('#notifications-count') .text(unread || '')
  $('#notifications-str')   .text(`(${hidden ? unread + '/' : ''}${count})`)
  $('#notifications-menu')  .children('.-hide-readed').text(hidden ? 'Ver todo' : 'Ver no leído')
}
