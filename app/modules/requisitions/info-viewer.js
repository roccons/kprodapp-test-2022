const EVT = require('./evt_ids')

function getStore() {
  return App.store.get(EVT.STORE)
}

function actions(/*ctx*/) {
  $('#requis-viewer-steps').on('show.bs.tab', 'a', function (e) {
    const toShow = e.target.getAttribute('data-idx') // newly activated tab
    const toHide = e.relatedTarget.getAttribute('data-idx') // previous active tab

    $('#requis-step-' + toHide).addClass('hide')
    $('#requis-step-' + toShow).removeClass('hide')
  })
}

module.exports = function infoViewer(id) {
  if (typeof id != 'number') id = getStore().resource_translated_id

  const viewer = require('./views/info-viewer.pug')
  const auth   = App.config
  const url    = auth.AUTORIA_URL.replace('{id}', id) + `?apikey=${auth.AUTORIA_KEY}`

  App.sideViewer(url, viewer, actions, {
    global: false,
    data: '',
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    beforeSend: function () {}
  })
}
