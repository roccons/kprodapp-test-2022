'use strict'

let conf

/*
  Tokenfield
  http://sliptree.github.io/bootstrap-tokenfield/
*/
const tk = $.fn.tokenfield
const proto = tk.Constructor.prototype

// Da el focus() al input del tokenfield cuando el original lo recibe
// listen() es llamado casi al final del constructor, antes de poner
// el autocomplete, por lo que es un buen lugar para intercaptar al constructor.
proto.__listen = proto.listen
proto.listen = function () {
  this.__listen()
  this.$element[0].focus = () => { this.$input.focus() }
}

// extends the tokenfield plugin with method for getting the input
proto.getInput = function () { return this.$input }

// change some defaults
conf = tk.defaults
conf.createTokensOnBlur = true
conf.beautify = false


/*
  DatePicker
  bootstrap-datepicker.readthedocs.io/en/stable/options.html
*/
conf = $.fn.datepicker.defaults
conf.language  = 'es-MX'
conf.autoclose = true
conf.todayBtn  = 'linked'
conf.assumeNearbyYear = 50
conf.enableOnReadonly = false
conf.todayHighlight   = true


/*
  Dropzone
  http://www.dropzonejs.com
*/

$.Dropzone.confirm = App.ui.yesNo

conf = $.Dropzone.prototype.defaultOptions
conf.uploadMultiple = true
conf.parallelUploads = 8
conf.dictDefaultMessage = 'Suelta aquí los archivos a subir'
conf.dictFallbackMessage = 'Tu navegador no soporta carga de archivos por Drag & Drop.'
conf.dictFallbackText = 'Por favor usa el formulario inferior para cargar tus archivos.'
conf.dictFileTooBig = 'El archivo es demasiado grande ({{filesize}}MB), el tamaño máximo es {{maxFilesize}}MB.'
conf.dictInvalidFileType = 'No puedes subir archivos de este tipo.'
conf.dictResponseError = 'El servidor respondió con un código {{statusCode}}.'
conf.dictCancelUpload = ''
conf.dictCancelUploadTooltip = 'Cancelar carga'
conf.dictCancelUploadConfirmation = '¿Estás seguro(a) que quieres cancelar ésta carga?'
conf.dictRemoveFile = ''
conf.dictRemoveFileTooltip = 'Remover'
conf.dictRemoveFileConfirmation = null
conf.dictMaxFilesExceeded = 'No puedes subir más archivos.'
conf.removeTemplate = '<button class="dz-remove wb-trash" data-dz-remove title="Remover"></button>'
conf.renameFilename = require('scripts/beautify-filename')


/*
  Make marked more GFM compatible
*/
conf = require('marked').defaults
conf.breaks = true
