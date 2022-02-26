'use strict'

const vowels = ['a', 'e', 'i', 'o', 'u']
const spc = ['z']

module.exports = function plural(words, pluralize) {
  if (!Array.isArray(words)) {
    words = [words]
  }

  if (!pluralize) {
    return words.join(' ')
  }

  return words.map(word => {
    const lastLetter = word.substr(-1)
    let wordPl = word
    if (vowels.includes(lastLetter.toLowerCase())) {
      wordPl = `${word}s`
    } else if (spc.includes(lastLetter.toLowerCase())) {
      wordPl = `${word.substr(0, word.length - 1)}ces`
    } else {
      wordPl = `${word}es`
    }
    if (lastLetter.toUpperCase() === lastLetter) {
      return wordPl.toUpperCase()
    }
    return wordPl
  }).join(' ')
}
