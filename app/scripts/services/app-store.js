/**
 * Depósito de datos de la App, implementado como observable.
 */
'use strict'

class AppStore {

  /*
    Cada objeto agregado se convierte automáticamente en observable.
    Este objeto puede tener 3 métodos opcionales:

    init:       Se ejecuta después de agregarse a la store.
    canDestroy: Devuelve trueish si el objeto puede removerse.
    destroy:    Se ejecuta después de remover el objeto de la store.

    Ejemplo:

    App.store.add('order', {
      data: {},
      property1: 'foo',
      canDestroy () {
        return document.section === 'orders'
      },
      init () {
        initialize(this)
        this.on('event1', doEnevt1)
      }
    })
  */

  constructor() {
    const observable = require('scripts/lib/observable')
    observable(this)

    Object.defineProperty(this, '_stores', {
      value: Object.create(null)
    })

    const _trigger = this.trigger

    const trigger2 = function (eventName, ...parms) {
      const length = parms.length

      if (!length) {
        _trigger(eventName)
      } else if (length === 1) {
        _trigger(eventName, parms[0])
      } else if (length === 2) {
        _trigger(eventName, parms[0], parms[1])
      } else {
        _trigger.apply(this, [eventName].concat(parms))
      }

      const stores = this._stores
      const keys = Object.keys(stores) // local copy of store keys

      for (let i = 0; i < keys.length; i++) {
        const store = stores[keys[i]]

        if (stores) {
          if (!length) {
            store.trigger(eventName)
          } else if (length === 1) {
            store.trigger(eventName, parms[0])
          } else if (length === 2) {
            store.trigger(eventName, parms[0], parms[1])
          } else {
            store.trigger.apply(store, [eventName].concat(parms)) // eslint-disable-line
          }
        }
      }

      return this
    }

    Object.defineProperty(this, 'trigger', {
      value: trigger2.bind(this),
      configurable: false
    })

    this.observable = observable
  }

  /**
   * Agrega un depósito, sobrescribiendo cualquiera existente
   * (se ejecuta el método detroy del depósito existente).
   *
   * @param   {String} name  - El nombre del depósito a agregar
   * @param   {Object} store - El depósito a agregar
   * @returns {Object}         El objeto recién agregado.
   */
  add(name, store) {
    const oldStore = this._stores[name]

    this._stores[name] = store = this.observable(store)
    if (store.init) {
      store.init()
    }

    if (oldStore) {
      oldStore.off()
      if (oldStore.destroy) {
        oldStore.destroy()
      }
    }

    return store
  }

  /**
   * Remueve el depósito con el nombre dado, excepto si su método
   * opcional `canDestroy` devuelve un valor no *falsy*.
   * Se ejecuta el método `destroy` del depósito después de removerlo.
   *
   * @param   {String} name - El nombre del depósito a remover
   * @returns {Object|null}   El objeto a remover si la operación falló, `null` si se removió.
   */
  remove(name) {
    const store = this._stores[name]

    if (store) {
      if (store.canDestroy && !store.canDestroy()) {
        return store
      }
      delete this._stores[name]

      store.off()
      if (store.destroy) {
        store.destroy()
      }
    }

    return null
  }

  /**
   * Remueve todos los depósitos cuyo método opcional `canDestroy`
   * devuelve un valor no *falsy*.
   * Se ejecuta el método `destroy` de cada depósito antes de removerlo.
   *
   * @returns {Object} this appStore.
   */
  clear() {
    Object.keys(this._stores).forEach(this.remove, this)
    return this
  }

  get(name) {
    return this._stores[name]
  }
}

module.exports = new AppStore()
