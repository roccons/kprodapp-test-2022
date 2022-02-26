/*
    Application Logger

    _log()
    Receives the message and severity: INFO (default), WARNING, ERROR, FATAL

    _error()
    Receives the message. The severity is set to ERROR
*/
'use strict'

const user    = require('./user')
const store   = require('store2')

const MEM_KEY = 'prodLogInfo'      // key for log info in window.localStorage
const MAX_LEN = 50

function _save(text, type) {
  const obj = {
    time: new Date(),
    user: user && user.userName || '(desconocido)',
    type: type,
    section: document.section,
    message: text
  }
  let lst = store(MEM_KEY)

  if (Array.isArray(lst)) {
    if (lst.unshift(obj) > MAX_LEN) lst.pop()
  } else {
    lst = [obj]
  }
  store(MEM_KEY, lst)
}

module.exports = {

  log(s) {
    console.log(s)
    _save(s, 'Info')
    return s
  },

  error(s, show) {
    if (show !== false) console.error(s)
    _save(s, 'Error')
    return s
  },

  clearLogs() {
    store.remove(MEM_KEY)
  },

  getLogs() {
    const lst = store(MEM_KEY)
    return lst && Array.isArray(lst) ? lst : []
  }

}
