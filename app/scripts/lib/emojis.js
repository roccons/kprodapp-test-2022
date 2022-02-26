'use strict'

const DEFAULTS = {

  emojies: require('./emojione'),

  // Emoticons -> Emoji mapping.
  //
  // (!) Some patterns skipped, to avoid collisions
  // without increase matcher complicity. Than can change in future.
  //
  // Places to look for more emoticons info:
  //
  // - http://en.wikipedia.org/wiki/List_of_emoticons#Western
  // - https://github.com/wooorm/emoticon/blob/master/Support.md
  // - http://factoryjoe.com/projects/emoticons/
  //
  shortcuts: {
    angry:            ['>:(', '>:-('],
    blush:            [':")', ':-")'],
    broken_heart:     ['</3', '<\\3'],
    // :\ and :-\ not used because of conflict with markdown escaping
    confused:         [':/', ':-/'], // twemoji shows question
    cry:              [":'(", ":'-(", ':,(', ':,-('],
    frowning:         [':(', ':-('],
    heart:            ['<3'],
    imp:              [']:(', ']:-('],
    innocent:         ['o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)'],
    joy:              [":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D'],
    kissing:          [':*', ':-*'],
    laughing:         ['x-)', 'X-)'],
    neutral_face:     [':|', ':-|'],
    open_mouth:       [':o', ':-o', ':O', ':-O'],
    rage:             [':@', ':-@'],
    smile:            [':D', ':-D'],
    smiley:           [':)', ':-)'],
    smiling_imp:      [']:)', ']:-)'],
    sob:              [":,'(", ":,'-(", ';(', ';-('],
    stuck_out_tongue: [':P', ':-P'],
    sunglasses:       ['8-)', 'B-)'],
    sweat:            [',:(', ',:-('],
    sweat_smile:      [',:)', ',:-)'],
    thumbsup:         ['+1'],
    thumbdown:        ['-1'],
    unamused:         [':s', ':-S', ':z', ':-Z', ':$', ':-$'],
    wink:             [';)', ';-)']
  }
}

// Convert input options to more useable format
// and compile search regexp

function quoteRE(str) {
  return str.replace(/(?=[.?*+^$[\]\\(){}|-])/g, '\\')
}

function normalizeOpts(options) {
  const emojies = options.emojies
  const names = Object.keys(emojies)


  // Flatten shortcuts to simple object: { alias: emoji_name }
  const shortcuts = Object.keys(options.shortcuts).reduce(function (acc, key) {
    // Skip aliases for filtered emojies, to reduce regexp
    if (emojies[key]) {
      if (Array.isArray(options.shortcuts[key])) {
        options.shortcuts[key].forEach(alias => { acc[alias] = key })
      } else {
        acc[options.shortcuts[key]] = key
      }
    }
    return acc
  }, {})

  // Compile regexp
  const rs_names = '(?:' +
    [`:(?:${names.join('|')}):`]
      .concat(Object.keys(shortcuts).map(quoteRE))
      .join('|') +
    ')'

  //const scanRE = RegExp(rs_names)
  const replaceRE = RegExp(rs_names + '(?![^\\s,)*_<":])', 'g') // ^\\s,

  return {
    names,
    emojies,
    shortcuts,
    //scanRE,
    replaceRE,
    prefixRE: /\W/
  }
}

// Emojies & shortcuts replacement logic.
//
// Note: In theory, it could be faster to parse :smile: in inline chain and
// leave only shortcuts here. But, who care...
//
// opts.emojies, opts.shortcuts, opts.scanRE, opts.replaceRE

function emojiReplacer(text) {
  const opts = this.options

  //if (!opts.scanRE.test(text)) return text
  if (!text) return text

  const prefixRE = opts.prefixRE

  return text.replace(opts.replaceRE, (match, offset, src) => {

    // Don't allow letters before any shortcut (as in no ":/" in http://)
    if (!offset || prefixRE.test(src[offset - 1])) {
      const name = opts.shortcuts[match] || match.slice(1, -1)

      if (opts.emojies[name]) return emojiImage.call(this, name)
    }

    return match
  })
}

function emojiSearch(name, callback, limit) {
  const names = this.options.names
  const result = []
  if (!limit) limit = this.options.maxResults || 100

  name = name.toLowerCase()
  for (let i = 0; i < names.length; i++) {
    if (!names[i].lastIndexOf(name)) {
      result.push(names[i])
      if (result.length >= limit) break
    }
  }

  callback(result)
}

function emojiImage(name) {
  const icon = this.options.emojies[name]
  const title = name.replace(/[_-]/g, ' ').replace(/\b[a-z]/g, m => m.toUpperCase())

  return `<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/${icon}` +
    `.png" alt="&#${icon};" title="${title}">`
}


module.exports = (function () {
  const opts = { options: normalizeOpts(assign({}, DEFAULTS)) }

  opts.replacer = emojiReplacer.bind(opts)
  opts.search = emojiSearch.bind(opts)
  opts.image = emojiImage.bind(opts)

  return opts
})()
