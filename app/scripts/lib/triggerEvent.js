module.exports = function triggerEvent(el, name) {
  'use strict'

  if (typeof el.dispatchEvent == 'function') {
    const event = document.createEvent('HTMLEvents')

    event.initEvent(name, true, true)
    event.eventName = name
    el.dispatchEvent(event)

  } else if (typeof el.fireEvent == 'function') {
    el.fireEvent('on' + name)

  } else if (typeof el[name] == 'function') {
    el[name]()
  }
}
