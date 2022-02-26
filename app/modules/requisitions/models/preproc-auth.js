'use strict'

function clean(s) {
  s = (s || '')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '<br>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/, ' ')
      .trim()

  while (s.slice(-4) === '<br>') {
    s = s.slice(0, -4).trim()
  }
  return s
}

function _preproc(dest, data) {     // eslint-disable-line complexity
  const res = data.resource || {}

  //dest.status = 'RR'
  dest.production_key = res.nomenclature || ''
  dest.location_key   = res.nomenclatureLocation || ''
  dest.resource_id    = ~~res.idResource
  dest.resource_original_id = ~~res.idResourceOriginal
  dest.resource_title = clean(res.titleOriginal || res.title)
  dest.resource_version_id  = ~~res.idResourceVersion
  dest.visible_for_student  = ~~res.isStudentVisible
  dest.is_mathematics = ~~res.isMathematics
  dest.is_coach = ~~res.isCoach

  // campos que se prellenan con datos obtenidos desde autoría
  dest.script            = clean(res.sampleUrl)
  dest.general_objective = clean(res.goal)
  dest.characteristics   = clean(res.features)
  dest.example           = clean(res.samples)
  dest.notes             = clean(res.notes)
  // agregados en marzo 2019
  dest.file_origin       = clean(res.fileOrigin)
  dest.knotions_bank_description = clean(res.goal)
  dest.resource_tags     = clean(res.keywords)
  dest.related_to        = clean(res.associated)
  dest.quicktags         = clean(res.quicktags)
  dest.is_translation    = ~~res.isTranslation

  // Copia datos desde resourcebank
  // a partir del id que tenía el recurso en esa plataforma
  // (lo obtenemos inicialmente a partir del idResourceInt que nos manda autoría)
  if ((dest.reference_resource_id = data.krb_resource_id)) {
    const krb = data.krb_resource
    // console.log(krb)
    // console.log(data)
    // los siguientes 3 campos se rellenan desde krb
    // solamente cuando no recibieron ningún valor desde autoría
    if (!dest.knotions_bank_description) dest.knotions_bank_description  = krb.description || ''
    if (!dest.resource_tags) dest.resource_tags = krb.tags && krb.tags.join(',') || ''
    if (!dest.related_to) dest.related_to = krb.relatedTo && krb.relatedTo.join(',') || ''
    dest.minimum_age                = krb.minimumAge | 0
    dest.maximum_age                = krb.maximumAge | 0
    dest.visible_for_coach          = krb.coachVisibility | 0
    dest.visible_for_parent         = krb.parentVisibility | 0
    dest.visible_for_student        = krb.studentVisibility | 0
    delete data.krb_resource
  }

  // solo informativos
  dest.set = dest.set || {}
  dest.cicle     = data.set.period && data.set.period.period
  dest.grade     = data.set.grade  && data.set.grade.grade
  dest.pathway   = data.pathway    && data.pathway.initials
  dest.challenge = data.challengeNumber
  dest.session   = data.session

  // por seguridad tomar solo version_id y a partir de allí obtener el group/type
  if (dest.resource_version_id) {
    const cat1 = App.catalogs.elemFromId('resource_versions', dest.resource_version_id)
    dest.resource_type_id = ~~(cat1 && cat1.resource_type_id)
    const cat2 = App.catalogs.elemFromId('resource_types', dest.resource_type_id)
    dest.resource_type_group_id = ~~(cat2 && cat2.resource_type_group_id)
  } else {
    const grp = res.resourceTypeGroup &&
                App.catalogs.idFromName('resource_type_groups', res.resourceTypeGroup)
    dest.resource_type_group_id = ~~grp
    dest.resource_type_id = 0
  }

  if (data.language) {
    dest.language = data.language.initials || ''
  } else {
    dest.language = data.idLanguage === 2 ? 'EN' : data.idLanguage === 1 ? 'ES' : ''
  }

  const info = data.activity && data.activity.steps || []
  const step = info.find(s => s.idStep === res.idStep)
  dest.step  = step ? step.number : '?'
}

/*
    Preprocesa los datos de la requisición recibida para editar.
*/
module.exports = function preprocAuth(ctx, data) {
  const req_empty  = require('./requisition')
  const ensureDate = require('scripts/lib/dates').ensureDate

  ctx = assign({}, req_empty, ctx)

  if (ctx._fromAuth && !ctx.__duplicated) {
    // viene de autoría, convertir los campos
    _preproc(ctx, data)

  } else {
    // interno, simple asignación
    assign(ctx, data)

    if (ctx.pathway && ctx.pathway.initials) {
      ctx.pathway = ctx.pathway.initials
    }

    if (typeof data.resource_version == 'string') {
      ctx.resource_type_group_id = ~~data.resource_type_group_id
      ctx.resource_type_id       = ~~data.resource_type_id
    } else {
      ctx.resource_type_group_id = ~~(data.resource_type_group && data.resource_type_group.id)
      ctx.resource_type_id       = ~~(data.resource_type       && data.resource_type.id)
    }
    ctx.resource_version_id = ~~data.resource_version_id
  }

  if (typeof ctx.quicktags != 'string') {
    ctx.quicktags = ctx.quicktags && ctx.quicktags.map(t => t.name).join(', ') || ''
  }
  const fields = Object.create(App.config.REQ_SPECS_FIELDS)
  // al editar una requisicion que viene de autoria(tiene resource_translated_id),
  // se agrega processType a los campos editables
  if (ctx._isPatch && ctx.resource_translated_id !== null) {
    fields.push(
      {
        name: 'process_type',
        translation: 'Process Type',
        input_type: 'select'
      }
    )
  }
  ctx._commonProps = fields.map(p => assign({ value: ctx[p.name] }, p))

  console.log(ctx._commonProps)

  if (!ctx.requisition_properties) ctx.requisition_properties = []

  if (ctx.created_at) ctx.created_at = ensureDate(ctx.created_at)

  return ctx
}
