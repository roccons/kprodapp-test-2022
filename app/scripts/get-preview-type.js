'use strict'

const TYPES = ['', 'image', 'audio', 'video', 'iframe']

const EXTS = {
  // IMG
  bmp: 1,
  gif: 1,
  jpeg: 1,
  jpg: 1,
  pic: 1,
  png: 1,
  webp: 1,
  // VEC (as IMG):
  cdr: 1,
  cgm: 1,
  svg: 1,
  svgz: 1,
  // AUDIO:
  aac: 2,
  fla: 2,
  flac: 2,
  flc: 2,
  m4a: 2,
  m4b: 2,
  mp3: 2,
  ogg: 2,
  voc: 2,
  wav: 2,
  weba: 2,
  // VIDEO:
  '3g2': 3,
  '3gp': 3,
  '3gpp': 3,
  avi: 3,
  flv: 3,
  m4v: 3,
  mkv: 3,
  mov: 3,
  mp4: 3,
  mpeg: 3,
  mpg: 3,
  ogv: 3,
  qt: 3,
  rm: 3,
  rmvb: 3,
  swf: 3,
  vob: 3,
  webm: 3,
  wmv: 3,
  // PDF in IFRAME:
  pdf: 4,
  fdf: 4
}

module.exports = function getPreviewType(path) {
  const pos = path ? path.lastIndexOf('.') : -1
  if (pos > 0) {
    const ext = path.slice(pos + 1).toLowerCase()
    return TYPES[~~EXTS[ext]]
  }
  return ''
}
