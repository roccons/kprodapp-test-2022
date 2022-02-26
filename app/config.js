/*
 * Global configuration
 */
'use strict'

const _ev = require('scripts/services/environment.js')

const conf = _ev.setEnv({

  APP_TITLE: 'Knotion Production Platform',

  /*
    Subcadena para comparar si el servidor actual es "production".
    Si no coincide entonces se usa el entorno que el usuario elija
    en preferencias o en app.conf o se toma el valor por defecto STG
  */
  SUBSTR_PROD: 'workflow.knotion.com',

  /*
    Nota sobre AUTORIA_URL: la url que se muestra en el editor de requisiciones
    (app/modules/requisitions/views/detail.pug)
    y que apunta a la plataforma de autoría NO se construye usando esta variable
    sino que la manda el GET de autoría como authoringUrl (authoring_url)
  */

  environments: {
    // Environment desarrollo
    DEV: {
      API_BASE: 'https://dev-workflow-api.knotion.com/kprod',
      FILES_BASE: 'https://s3-us-west-2.amazonaws.com/dev-knotionworkflow-files',
      IMG_BASE: 'https://s3-us-west-2.amazonaws.com/dev-knotion-resources',
      KRB_API_BASE: 'https://dev-resourcebank-api.knotion.com/krb',
      KRB_URL_BASE: 'http://localhost:3333/#',
      AUTORIA_URL: 'https://stg-autoria.knotion.com/api-auth/resources/{id}',
      AUTORIA_KEY: '47cf15f4ac4d266d334e9cb30ace5e5f4e7ab09c',
      PUSHER_KEY: '406b01b7cc80376e979d'
    },
    // Environment "staging" o preproducción
    STG: {
      API_BASE: 'https://stg-workflow-api.knotion.com/kprod',
      FILES_BASE: 'https://s3-us-west-2.amazonaws.com/stg-knotionworkflow-files',
      IMG_BASE: 'https://s3-us-west-2.amazonaws.com/stg-knotion-resources',
      KRB_API_BASE: 'https://stg-resourcebank-api.knotion.com/krb',
      KRB_URL_BASE: 'http://krb-app.s3-website-us-west-2.amazonaws.com/#',
      AUTORIA_URL: 'https://stg-autoria.knotion.com/api-auth/resources/{id}',
      AUTORIA_KEY: '47cf15f4ac4d266d334e9cb30ace5e5f4e7ab09c',
      PUSHER_KEY: '88b22dddc730ed6d69c3'
    }
  },

  CARDS_PER_PAGE: 100,            // Máximo número de OPs a cargar en Vista de tarjetas

  ONE_MB: 1000 * 1000,            // 1 MB = 1000 Kb

  MAXSIZE_PREVIEW: 1024 * 500,    // max size for automatic preview (500 kb)

  // Los tamaños son en MB
  MAXSIZE_THUMBNAIL: 0.4,
  MAXSIZE_DELIVERY: 100,

  DEF_INDEX_COACH: 'index_ch.html',
  DEF_INDEX_STUDENT: 'index_st.html',

  ED_REQ_STATUS: /^(?:EE|RR|AA|DD|CA|PP|AR|EI)$/,

  TESTER_STATUSES: /^(?:RJ|DD)$/,

  DEFAULTS: {
    requisition_type_str: 'Challenges request',
    requisition_production: 'Knotion',
    requisition_status: $_REQ_ST.PENDING
  },

  // common fields to all orders (utilizado solamente en visor antiguo)
  SPECS_FIELDS: [
    {
      name: 'script',
      translation: 'Script',
      input_type: 'url'
    }, {
      name: 'resource_tags',          // master_requisition
      translation: 'Keywords',
      input_type: 'Tokenfield',
      from_master: true
    }, {
      name: 'quicktags',
      translation: 'QuickTags',
      input_type: 'Tokenfield',
      as_array: true,
      editable: true
    }, {
      name: 'resource_tags',
      translation: 'Palabras clave',
      input_type: 'Tokenfield',
      required: true
    }, {
      name: 'related_to',
      translation: 'Relacionado con',
      input_type: 'Tokenfield',
      required: false,
      editable: true
    }, {
      name: 'general_objective',      // master_requisition
      translation: 'General Objective',
      from_master: true
    }, {
      name: 'knotions_bank_description',
      translation: 'Knotion Bank Description',
      required: true,
      editable: true
    }, {
      name: 'characteristics',
      translation: 'Characteristics',
      editable: true
    }, {
      name: 'example',
      translation: 'Samples',
      editable: true
    }, {
      name: 'notes',
      translation: 'Notes',
      editable: true
    }
  ],

  // common fields to all requisitions
  REQ_SPECS_FIELDS: [
    {
      name: 'file_origin',
      translation: 'Origen',
      input_type: 'select'
    },
    {
      name: 'requisition_type_str',
      translation: 'Tipo de requisición',
      input_type: 'select',
      required: true
    }, {
      name: 'script',
      translation: 'Script',
      input_type: 'url',
      required: true
    }, {
      name: 'resource_tags',
      translation: 'Palabras clave',
      input_type: 'Tokenfield',
      required: true
    }, {
      name: 'related_to',
      translation: 'Relacionado con',
      input_type: 'Tokenfield',
      required: false,
      editable: true
    }, {
      name: 'quicktags',
      translation: 'QuickTags',
      input_type: 'Tokenfield',
      editable: true
    }, {
      name: 'general_objective',
      translation: 'Objetivo General'
    }, {
      name: 'knotions_bank_description',
      translation: 'Descripción para Resource Bank',
      required: true,
      editable: true
    }, {
      name: 'characteristics',
      translation: 'Características',
      editable: true
    }, {
      name: 'example',
      translation: 'Ejemplos',
      editable: true
    }, {
      name: 'notes',
      translation: 'Notas',
      editable: true
    }, {
      name: 'production_id',
      translation: 'Producción',
      input_type: 'select',
      required: true
    }
  ],

  R_MENTIONS_REPL: /(^|\W)@([-@\.\w\xA0-\xFF]+)\b/g,
  R_MENTIONS_SEARCH: /(^|\W)@([-@\.\w\xA0-\xFF]*)$/,

  RO_TASKS_ORDER_ST: /^(DD|RP|PP)$/,

  // *** Add properties bellow to avoid conflicts ***
  version: '$_VERSION',
  devlink: 'http://habitatweb.mx'

})


module.exports = conf
