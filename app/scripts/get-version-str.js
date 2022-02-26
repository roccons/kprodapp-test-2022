/**
 * Devuelve el nombre completo de la versión, es decir precedido por
 * el nombre del grupo y el tipo, separados por puntos (bullet).
 *
 * @param   {number} ver - ID de la versión
 * @returns {string} El nombre completo de la versión.
 */
module.exports = function getVersionStr(ver) {
  const fromId = App.catalogs.elemFromId

  if (!ver) return '(sin versión)'

  const cVer  = fromId('resource_versions', ver) || {}
  const cType = fromId('resource_types', cVer.resource_type_id) || {}
  const cGrp  = fromId('resource_type_groups', cType.resource_type_group_id) || {}

  const grpName = cGrp.name || 'Categoría de recurso eliminada'
  const typeName = cType.name || 'Tipo de recurso eliminado'
  const verName = cVer.name || 'Versión de recurso eliminada'

  return `${grpName} \u2219 ${typeName} \u2219 ${verName}`
}
