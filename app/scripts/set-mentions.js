'use strict'

//https://yuku-t.com/jquery-textcomplete/
const emojis = require('scripts/lib/emojis')
const users  = App.catalogs.get('users')

function _search(term, callback) {
  if (term) {
    term = term.toLowerCase()
    callback(users.filter(u => !u.uname.lastIndexOf(term, 0)))
  } else {
    callback(users.slice(0, 10))
  }
}

function _replace(user) {
  return `$1@${user.userName} `
}

function _template(user) {
  return `@${user.userName} (${user.name})`
}

function _eTemplate(name) {
  return `<span class="emojibox">${emojis.image(name)}</span> ${name}`
}

function _eReplace(name) {
  return `:${name}: `
}

/**
 * Agrega soporte de menciones al elemento.
 * @param  {any} input - Elemento o selector jQuery que soportará menciones.
 * @param  {string} container - Selector jQuery donde "colgar" el popup.
 */
module.exports = function setMentions(input, container) {
  'use strict'

  emojis.options.maxResults = 10

  //{footer: '<a href="http://www.emoji.codes" target="_blank">Browse All<span class="arrow">»</span></a>'}
  $(input).textcomplete([
    {
      id:         'users',
      idProperty: 'userName',
      match:      App.config.R_MENTIONS_SEARCH,
      template:   _template,
      replace:    _replace,
      search:     _search,
    },
    {
      id:         'emojis',
      match:      /\B:([\-+\w]+)\b/,
      template:   _eTemplate,
      replace:    _eReplace,
      search:     emojis.search,
      index:      1,
    }
  ], {
    maxCount: 10,
    appendTo: container || 'body',
    debounce: 200,
    zIndex: 99999,
  })
}
