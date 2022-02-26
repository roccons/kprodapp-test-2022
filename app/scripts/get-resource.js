module.exports = function (resourceId) {
  const url = `${App.config.KRB_API_BASE}/resources/advancedSearch`
  const data = {
    idResource_int: resourceId,
    show_apps: true
  }

  return App.server(url, 'POST', { data })
}
