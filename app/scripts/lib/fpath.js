/*
  Filename conversion routines using slash as path separator

  (c) 2016 Habitat Web. Licence MIT ?

  2017-03-19 Revision by aMarCruz.
  2016-04-30 Adaptated by aMarCruz from VFP fpath routines.

  AGAIN: Note is assumed all paths is in Unix format (i.e using '/')

*/
'use strict'

// Returns the start of the extension for the given filename,
// or -1 if the filename has no extension.
//
function _startOfExt(fname) {
  const point = fname.lastIndexOf('.')

  // skip first dot in names like '.file'
  if (point > 0 && point < fname.length) {
    // +1 give min(1) to skip names like '/.fname'
    const slash = fname.lastIndexOf('/') + 1
    // also, check for '..', so slash<length ?
    if (point > slash) return point + 1
  }

  return -1
}

// Add a slash to path, except if path is blank or already has slash.
//
function addBS(fpath) {
  return fpath && fpath.slice(-1) !== '/' ? fpath + '/' : fpath
}

/**
 * Returns the path from the given filename, including the last slash.
 *
 * @param   {string} fname - Filename
 * @returns {string} The path in filename.
 */
function justPath(fname) {
  if (fname) {
    const pos = fname.lastIndexOf('/') + 1
    if (pos) {
      const name = fname.slice(pos) || '.'
      return name === '.' || name === '..' ? fname : fname.slice(0, pos)
    }
    if (fname === '.' || fname === '..') {
      return fname
    }
  }
  return ''
}

// Returns the filename w/o extension of the given path
//
function justStem(fname) {
  if (fname) {
    const path = fname.split(/[\\/]/).pop()
    if (path === '.' || path === '..') return ''
    const j = path.lastIndexOf('.')
    fname = j > 1 ? path.slice(0, j) : path
  }
  return fname || ''
}

// Returns the filename w/o extension of the given path
//
function justFname(fname) {
  if (fname) {
    return fname === '.' || fname === '..'
      ? '' : fname.slice(fname.lastIndexOf('/') + 1)
  }
  return fname || ''
}

// Returns the extension without the dot
//
function justExt(fname) {
  const p = fname ? _startOfExt(fname) : -1

  return ~p ? fname.slice(p) : ''
}

// Forces filename to have the given extension
//
function forceExt(fname, newext) {
  if (!fname ||
    fname === '.' || fname === '..' || fname.slice(-1) === '/') {
    return fname
  }
  const pos = _startOfExt(fname)

  if (~pos) {
    fname = fname.slice(0, pos)
  } else {
    fname += '.'
  }
  if (newext[0] === '.') {
    newext = newext.slice(1)
  }
  return fname + newext
}

// Forces filename to have the given path
//
function forcePath(fname, fpath) {
  if (!fname ||
    fname === '.' || fname === '..' || fname === '/') {
    return fname && fpath
  }
  const j = fname.lastIndexOf('/')

  return addBS(fpath) + (~j ? fname.slice(j + 1) : fname)
}

// Forces filename to have the given extension
//
function defaultExt(fname, fext) {
  if (!fname ||
    fname === '.' || fname === '..' || fname.slice(-1) === '/') {
    return fname
  }
  return ~_startOfExt(fname) ? fname : forceExt(fname, fext)
}

// filename normalization
//
function normalize(fname) {
  return fname ? fname.replace(/\\/g, '/').trim() : ''
}

module.exports = {
  addBS,
  justPath,
  justStem,
  justFname,
  justExt,
  forceExt,
  forcePath,
  defaultExt,
  normalize
}
