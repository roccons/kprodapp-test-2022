module.exports = function getVersionInfo(version) {

  const cVer   = version && App.catalogs.elemFromId('resource_versions', version)
  const type   = ~~(cVer && cVer.resource_type_id)
  const cType  = type && App.catalogs.elemFromId('resource_types', type)
  const group  = ~~(cType && cType.resource_type_group_id)

  if (group) {
    return {
      resource_type_group_id: group,
      resource_type_group: App.catalogs.nameFromId('resource_type_groups', group),
      resource_type_id: type,
      resource_type: cType.name,
      resource_version_id: version,
      resource_version: cVer.name,
    }
  }

  return null
}
