const session = require('store2').session
const KRB_AUTH = `${session.get('user-info').idUser}:${App.config.KRB_API_KEY}`
module.exports = function (resourceId) {
  const url = `${App.config.KRB_API_BASE}/resources/advancedSearch`
  const data = {
    idResource_int: resourceId,
    show_apps: true,
  }

  return App.server(url, 'POST', { data }, KRB_AUTH)
}
