/**
 * Rutina de actualización/sincronización de los SELECTs (easySelect) de edición.
 *
 * @param  {object} ctx  - El contexto (estado del form)
 * @param  {object} root - El objeto controlador (donde se hizo clic)
 */
module.exports = function resetSelects(ctx, root) {
  const form = root.form

  if (root.name === 'resource_type_group_id') {
    const group = ~~root.easySelect().getValue()
    const types = App.catalogs.get('resource_types')
      .reduce((arr, c) => {
        if (c.resource_type_group_id === group) arr.push(c)
        return arr
      }, [''])
    form.resource_type_id.easySelect().setOptions(types)._setEasyDisab(!group)
    ctx._state.last_group = group
  }

  // resource_type ids for resource_version
  const type = ~~form.resource_type_id.easySelect().getValue()
  const vers = App.catalogs.get('resource_versions')
    .reduce((arr, c) => {
      if (c.resource_type_id === type) arr.push(c)
      return arr
    }, [''])
  form.resource_version_id.easySelect().setOptions(vers)._setEasyDisab(!type)
  ctx.last_type = type
}
