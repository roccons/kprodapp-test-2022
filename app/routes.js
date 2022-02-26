const APP_TITLE = require('config').APP_TITLE

const _routes = {

  controllersPath: 'modules/',

  routes: [
    {
      path: '#/requisiciones',
      pageTitle: 'Requisiciones',
      section: 'requisitions',
      controller: 'requisitions/panel'
    }, {
      path: '#/requisicion/:id',
      pageTitle: 'Detalle de requisición',
      section: 'requisitions',
      controller: 'requisitions/detail'
    }, {
      path: '#/requisicion/:id/:action',
      pageTitle: 'Crear requisición',
      section: 'requisitions',
      controller: 'requisitions/create'
    }, {
      path: '#/requisicion/nueva',
      pageTitle: 'Crear requisición',
      section: 'requisitions',
      controller: 'requisitions/create'
    },
  ],

  notFound: {
    title: APP_TITLE,
    pageTitle: 'Página no encontrada',
    section: '',
    controller: 'notFound'
  },

  menu: [
    {
      title: 'Requisiciones',
      url: '#/requisiciones',
      section: 'requisitions',
      icon: 'wb-add-file'
    },
  ],
}

module.exports = _routes
