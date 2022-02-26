/*
 * UI components
 */
'use strict'

/*---------------------------------------------------------------------------
 * Aviso
 *
 * Guía de componentes #13
 *
 * toastr personalizado corrige errores en la definición de 'danger'
 */
const toastr = require('scripts/lib/toastr')

toastr.danger = toastr.error
toastr.options.closeButton = true
toastr.options.timeOut = 7500         // 75 secs

/*---------------------------------------------------------------------------
 * Alerta
 *
 * Guía de componentes #14
 *
 * Se personalizan para un uso más sencillo
 */
const alert = require('scripts/lib/easyalert')
alert.toast = toastr

module.exports = alert
