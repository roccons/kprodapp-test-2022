module.exports = function openInTab(url) {
  const a = document.createElement('a')
  a.setAttribute('target', '_blank')

  // El queryString siguiendo al hash no es válido y setAttribute
  // lo elimina. Poniéndolo directamente en `href` se evita esto.
  a.href = url

  try {
    const evt = new MouseEvent('click', {
      ctrlKey: true,
      metaKey: true
    })
    a.dispatchEvent(evt)
  } catch (_) {
    a.click()
  }
}
