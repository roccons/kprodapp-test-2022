'use strict'

/* eslint camelcase: 0 */

const MEMKEY  = 'user-info'
const CARDKEY = 'cards-filters'
const DEFUSR  = { authKey: '0', userName: 'anónimo', idUser: '', idCountry: '', userType: '', in: 0, permissions: [] }

const cookies = require('js-cookie')
const session = require('store2').session

let _user = {}

/**
 * Set the authkey and tzo for use in $.ajax() and Dropzone.
 *
 * @param {string} key - String with the authorization key
 * @private
 */
function _setAuthKey(key) {
  const opts = $.Dropzone.prototype.defaultOptions

  if (!opts.headers) opts.headers = {}
  opts.headers.Authorization = key
  opts.headers['X-tzo'] = App.tzo

  $.ajaxSetup({
    beforeSend(xhr) {
      // url puede no existir si el contexto de ajax fue cambiado,
      // si se está llamando del sidebar está en this._instance.
      const url = this.url || this._instance && this._instance.url
      if (!url || url.indexOf('/api-auth/') < 0) {
        xhr.setRequestHeader('Authorization', key)
        xhr.setRequestHeader('X-tzo', App.tzo)
      }
    }
  })
}

function _logout() {
  const opts = $.Dropzone.prototype.defaultOptions

  opts.headers = {}

  $.ajaxSetup({ beforeSend: undefined })

  session.remove(MEMKEY)
  session.remove(CARDKEY)
  cookies.remove(MEMKEY)

  if (_user.authKey) {
    _user = assign({}, _user, DEFUSR)
    App.trigger('user:logout')
  }
}

/**
 * Saves the user data once successful login, returns true.
 *
 * @param   {object}  usr - Callback for successful login.
 * @returns {boolean} true if success, false if some type mismatch.
 */
function _login(usr) {
  const STRING = 'string'

  if (usr &&
      typeof usr.auth_key  === STRING &&
      typeof usr.token     === STRING &&
      typeof usr.userName  === STRING &&
      typeof usr.idUser    === STRING &&
      typeof usr.idCountry === STRING) {

    usr = {
      auth_key:     usr.auth_key,
      token:        usr.token,
      userName:     usr.userName,
      firstName:    usr.firstName || usr.userName,
      secondName:   usr.secondName,
      firstSurname: usr.firstSurname,
      idUser:       usr.idUser,
      idCountry:    usr.idCountry,
      userType:     usr.userType || '',
      userTypes:    usr.userTypes || [],
      permissions:  (usr.permissions || []).map(p => { return { name: p.name, value: p.value } }),
      in:           usr.in || Date.now()
    }

    _user = {
      authKey:      `${usr.auth_key}:${usr.token}`,
      userName:     usr.userName,
      fullName:     usr.firstName +
        (usr.secondName ? ` ${usr.secondName}` : '') +
        (usr.firstSurname ? ` ${usr.firstSurname}` : ''),
      idUser:       usr.idUser,
      idCountry:    usr.idCountry,
      userType:     usr.userType,
      userTypes:    usr.userTypes,
      permissions:  usr.permissions,
      in:           usr.in
    }

    _setAuthKey(_user.authKey)
    session.set(MEMKEY, usr)
    cookies.set(MEMKEY, usr)
    App.trigger('user:login')
    return true
  }

  _logout()
  return false
}


/**
 * Try to login an user with the data in the received form.
 *
 * @param {object}   form   - The form with username and password fields.
 * @param {function} doneFn - Callback for login result.
 * @param {function} failFn - Callback for ajax error.
 */
function login(form, doneFn, failFn) {
  const data = {
    user: form.username.value.trim(),
    password: form.password.value.trim()
  }
  const opts = {
    url: `${App.config.API_BASE}/userLogin`,
    method: 'POST',
    contentType: 'application/json; charset=UTF-8',
    dataType: 'json',
    data: JSON.stringify(data)
  }

  const _done = usr => {
    doneFn(_login(usr))
  }

  $.ajax(opts).then(_done, failFn)
}


/**
 * Kills the current user session and redirect the page to the login form.
 *
 * @param {boolean} [silent] - Pass true if yo don't want confirmation
 */
function logout(silent) {

  const _out = () => {
    _logout()
    setTimeout(() => { window.location.href = '/' }, 100)
  }

  if (silent === true) _out()
  else {
    App.ui.confirm('¿Estás seguro que deseas terminar la sesión actual?', _out)
  }
}


/**
 * Check the session state of the user.
 *
 * @returns {boolean} true if the user is logged in.
 */
function logged() {
  if (!_user.in) {
    const usr = session.get(MEMKEY) || cookies.getJSON(MEMKEY)
    if (usr && typeof usr == 'object' && usr.in) _login(usr)
  }
  return !!_user.in
}


/**
 * Check if the current user have one of the required permissions.
 * Send the role(s) without the "KPROD_" prefix.
 *
 * @param   {Array<string>|string} roles - The required roles
 * @returns {boolean} true if the user has the permission.
 */
function has(roles) {
  if (!Array.isArray(roles)) roles = [roles]
  const types = _user.userTypes

  for (let i = 0; i < roles.length; i++) {
    const rol = 'KPROD_' + roles[i].toUpperCase()
    if (~types.indexOf(rol)) return true
  }
  return false
}


module.exports = {
  login,
  logout,
  logged,
  has,
  getRoles()      { return _user.userTypes },
  getType()       { return _user.userType },
  getPerms()      { return _user.permissions },
  get id()        { return _user.idUser },
  get userName()  { return _user.userName },
  get fullName()  { return _user.fullName },
  get country()   { return _user.idCountry },
  get startTime() { return _user.in }
}
