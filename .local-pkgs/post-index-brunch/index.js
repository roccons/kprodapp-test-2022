'use strict'

const { existsSync, readFileSync, writeFileSync } = require('fs')
const { resolve, relative } = require('path')
const crc32 = require('crc-32')

const seedBuf = seedText => crc32.buf(Buffer.from(seedText, 'utf8'))
const seedStr = seedText => crc32.str(seedText)

const CONF = './app.conf'

const getEnv = dev => {
  try {
    if (dev && existsSync(CONF)) {
      const buf = readFileSync(CONF)
      const env = /entorno\s*=\s*([A-Z]+)/i.exec(buf)
      return (env && env.length > 1 && env[1].toUpperCase()) || ''
    }
  } catch (_) {}
  return ''
}

const getUrl = dev => {
  try {
    if (dev && existsSync(CONF)) {
      const buf = readFileSync(CONF)
      const env = /api_base\s*=\s*(\S+)/i.exec(buf)
      return (env && env.length > 1 && env[1]) || ''
    }
  } catch (_) {}
  return ''
}

/**
 * Recibe un Buffer o una cadena y devuelve una cadena hex con el crc-32
 * como un _unsigned_ (siempre deberían producirse 8 caracteres).
 *
 * @param {string} file
 * @param {string} name
 * @returns {string}
 */
const getCrc = (file, name) => {
  try {
    const code = readFileSync(file)
    const crc =
      typeof code === 'string'
        ? crc32.str(code, seedStr(name))
        : crc32.buf(code, seedBuf(name))

    // toLowerCase() no es necesario según el estándar, pero...
    return (crc < 0 ? 1465349286 - crc : crc).toString(16).toLowerCase()
  } catch (_) {
    return '0'
  }
}

const _paths = {
  js: '',
  css: '',
}

/**
 * @param {string} root
 * @param {string} file
 */
const getRelative = (root, file) => relative(root, file).replace(/\\/g, '/')

// Documentation for Brunch plugins:
// https://github.com/brunch/brunch/blob/master/docs/plugins.md

// Remove everything your plugin doesn't need.
class PostIndexPlugin {
  //
  constructor(config) {
    // Replace 'plugin' with your plugin's name.
    // Don't include 'brunch' or 'plugin' words in configuration key.
    const root = resolve(config.paths.root)
    this.config = {
      ...config.plugins.postIndex,
      root,
      pubDir: resolve(root, config.paths.public),
      dev: config.env.includes('development'),
    }
  }

  /**
   * Executed when each compilation is finished.
   * @param {object[]} files
   * @returns {null}
   */
  onCompile(files) {
    const { dev, root, pubDir } = this.config
    const index = resolve(pubDir, this.config.index || 'index.html')

    files.forEach(o => {
      if (o.type === 'javascript') {
        _paths.js = o.path
      } else if (o.type === 'stylesheet') {
        _paths.css = o.path
      }
    })

    if (!_paths.js || !_paths.css) {
      console.error('Incomplete info in paths:')
      console.dir(_paths)
    }

    const js = resolve(root, _paths.js)
    const css = resolve(root, _paths.css)
    const jsRelative = getRelative(pubDir, js)
    const cssRelative = getRelative(pubDir, css)
    const hdrRelative = 'js/header.js'
    const header = resolve(pubDir, hdrRelative)

    const html = readFileSync(index, 'utf8')
      .replace(/\bapp\.js\?crc/g, `${jsRelative}?v=${getCrc(js, jsRelative)}`)
      .replace(/\bapp\.css\?crc/g, `${cssRelative}?v=${getCrc(css, cssRelative)}`)
      .replace(/\bheader\.js\?crc/g, `${hdrRelative}?v=${getCrc(header, hdrRelative)}`)
      .replace(/\bdocument.body._env=['"]['"]/g, `document.body._env="${getEnv(dev)}"`)
      .replace(/\bdocument.body._url=['"]['"]/g, `document.body._url="${getUrl(dev)}"`)

    writeFileSync(index, html, 'utf8')
    return null
  }
}

PostIndexPlugin.prototype.brunchPlugin = true
PostIndexPlugin.prototype.pattern = /\.(html|jsx|css)$/

module.exports = PostIndexPlugin
