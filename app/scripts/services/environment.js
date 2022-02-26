'use strict'

const store = require('store2')
const ENVKEY = '_locEnvData'

const RE_ENVS = /^(?:DEV|STG|CUSTOM)$/
const STG = 'STG'
const DEV = 'DEV'
const CUST = 'CUSTOM'

/**
 * Determina el entorno donde ejecutar la App.
 * 1. En staging o production siempre se usa el entorno STG o PROD
 * 2. En modo "watch" se usa el entorno definido en app.conf
 * 3. Si no es watch o no hay app.conf, usar el seleccionado en la UI
 * 4. Si no hay nada de lo anterior, usar el entorno default (STG)
 *
 * NOTE:
 * app.conf se lee solamente al compilar la App y sus valores se escriben
 * en el `<body>` de index.html, en las propiedades `_env` y `_url` que
 * corresponden a los valores de `entorno` y `api_base` respectivamente.
 * Esto se hace en project://.local-pkgs/post-index-brunch/index.js
 *
 * @param {object} [conf] Configuración de la App.
 * @returns {string} El nombre de uno de los entornos reconocidos.
 */
const getEnviron = conf => {
  const host = window.location.host
  conf = conf || App.config

  // En Producción siempre es el entorno "PROD"
  if (~host.indexOf(conf.SUBSTR_PROD)) {
    return 'PROD'
  }
  // En modo watch se usará el valor del app.conf
  const env = document.body._env
  if (env) {
    return env === 'LOCAL' ? CUST : env
  }
  // Si no hay app.conf se usará lo seleccionado en la UI
  const lastEnv = store.get(ENVKEY)
  if (lastEnv && RE_ENVS.test(lastEnv.loc)) {
    return lastEnv.loc
  }
  // Si no hay entorno seleccionado, usar el default
  return STG
}

const customURL = () => document.body._url || (store.get(ENVKEY) || {}).url || ''

const setEnv = conf => {
  const environments = conf.environments

  let envName = getEnviron(conf)
  if (envName === CUST) {
    const API_BASE = customURL()

    if (API_BASE) {
      environments.CUSTOM = { ...environments.DEV, API_BASE }
    } else {
      console.warn('API_BASE no definida para el entorno LOCAL.')
      envName = DEV
    }
  }

  conf._ISDEVEL = envName === DEV || envName === CUST
  conf._ENVIRON = envName

  const envValues = environments[envName]
  //
  Object.keys(envValues).forEach(k => {
    Object.defineProperty(conf, k, { value: envValues[k], enumerable: true })
  })

  return conf
}

const saveEnv = (loc, url) => {
  if (RE_ENVS.test(loc)) {
    url = url ? url.trim() : ''
    document.body._env = loc
    document.body._url = url
    store.set(ENVKEY, { loc, url })
  } else {
    store.remove(ENVKEY)
  }
}

module.exports = {
  setEnv,
  saveEnv,
  getEnviron,
  customURL,
}
