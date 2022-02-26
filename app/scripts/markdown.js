const marked = require('marked')
const emojis = require('./lib/emojis')

function encode(s) {
  return String(s)
    .replace(/<br>/g, '\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

module.exports = function markdown(s) {
  if (!s) return ''
  s = emojis.replacer(encode(s))

  // soporta citaciones con ">"
  if (~s.indexOf('&gt;')) {
    s = s
      .replace(/^([ \t]*)&gt;/gm, '$1>')
      .replace(/^([ \t]*>)&gt;/gm, '$1>')
      .replace(/^([ \t]*>>)&gt;/gm, '$1>')
  }
  return marked(s)
    .replace(/<table>/g, '<table class="table table-condensed table-striped table-bordered">')
    .replace(/&amp;quot;/g, '"')
    .replace(App.config.R_MENTIONS_REPL, (m, p, uname) => {
      const user = App.catalogs.userByUname(uname)
      return user ? `${p}<span class="mention" title="${user.userName}">${user.name}</span>` : m
    })
}
