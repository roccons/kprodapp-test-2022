/* eslint max-len:0 */
module.exports = function preprocData(data) {
  const getVersionInfo = require('scripts/get-version-info')
  const ensureDate = require('scripts/lib/dates').ensureDate

  // convierte fechas del formato DB a intancias de JS Date
  data.created_at = ensureDate(data.created_at)

  if (!data.versions) data.versions = []
  data.resource_version_id = ~~(data.resource_version && data.resource_version.id)

  if (!data.classification) data.classification = 'Curricular'

  let cur_ver = false   // para guardar la info de version

  if (data.needs_review) {
    const versions = data.versions

    for (let i = 0; i < versions.length; i++) {
      const ver = versions[i]
      if (ver.requires_approval &&
          ver.new_value === data.resource_version_id && ver.field_name === 'resource_version_id') {
        cur_ver = getVersionInfo(ver.field_value)
        // intercambia el valor de versión, para simplificar el manejo de PA en la UI
        if (cur_ver) {
          data.review_data = getVersionInfo(data.resource_version_id) || {}
          data.review_data.number = ver.version_number
        }
        break
      }
    }
  }

  if (!cur_ver) cur_ver = getVersionInfo(data.resource_version_id)
  if (cur_ver) assign(data, cur_ver)
  else data.resource_version_id = data.resource_type_id = data.resource_type_group_id = 0

  data.quicktags = data.quicktags && data.quicktags.map(t => t.name).join(', ') || ''
  data._commonProps = App.config.REQ_SPECS_FIELDS.map(p => assign({ value: data[p.name] }, p))

  return data
}
