'use strict'

const PDF_EXT = /\.(?:pdf|fdf)$/i
const IS_HTTP = /^https?:\/\//i

module.exports = function (path, frames, title) {
  const getPreviewType = require('scripts/get-preview-type')
  const fpath = require('scripts/lib/fpath')
  const type = getPreviewType(path)
  const base = IS_HTTP.test(path) ? path : `${App.config.FILES_BASE}/${path}`
  let html
  title = typeof title == 'string' ? title : fpath.justFname(path)

  if (type === 'image') {
    html = `<img class="dz-thumbnail" src="${base}" alt="Imagen" title="${title}">`

  } else if (type === 'audio') {
    html = `<audio class="dz-thumbnail" src="${base}" controls></audio>`

  } else if (type === 'video') {
    html = `<video class="dz-thumbnail" src="${base}" controls></video>`

  } else if (frames === true && type === 'iframe') {
    if (PDF_EXT.test(path)) {
      html = `<div class="dz-frame embed-responsive" style="width:100%;height:100%"><object data="${
        base + (App.isFF || App.isIE ? '#view=FitH' : '#zoom=20')
        }" type="application/pdf" style="width:100%" trusted="yes"></object></div>`
    } else {
      html = `<iframe class="dz-frame" src="${base}" frameborder="0" style="background:#fff"></iframe>`
    }
  }

  return html || App.genericIcon(path)
}
