/**
 * Bootstrap Table Spanish (México) translation
 * Author: Felix Vera (felix.vera@gmail.com)
 * Copiado: Mauricio Vera (mauricioa.vera@gmail.com)
 */
(function ($) {
  'use strict'

  $.fn.bootstrapTable.locales['es-MX'] = {
    formatLoadingMessage: function () {
      return 'Cargando, espere por favor...'
    },
    formatRecordsPerPage: function (pageNumber) {
      return pageNumber + ' registros por página'
    },
    formatShowingRows: function (pageFrom, pageTo, totalRows) {
      if (!totalRows) totalRows = pageTo
      if (pageFrom === 1 && pageTo === totalRows) pageTo = 0
      return 'Mostrando ' + (pageTo ? pageFrom + ' a ' + pageTo : totalRows) + ' de ' + totalRows + ' filas'
    },
    formatDetailPagination: function (totalRows) {
      return 'Mostrando ' + totalRows + ' filas'
    },
    formatSearch: function () {
      return 'Buscar'
    },
    formatNoMatches: function () {
      return 'No se encontraron registros'
    },
    formatPaginationSwitch: function () {
      return 'Ocultar/Mostrar paginación'
    },
    formatRefresh: function () {
      return 'Actualizar'
    },
    formatToggle: function () {
      return 'Alternar vista'
    },
    formatColumns: function () {
      return 'Seleccionar columnas'
    },
    formatAllRows: function () {
      return 'Todo'
    }
  }

  $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-MX'])

})(jQuery)
