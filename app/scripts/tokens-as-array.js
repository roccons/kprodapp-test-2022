/*
 * Helper for tokenfield plugin, returns the token labels in an array.
 */
module.exports = function tokensAsArray(el) {

  const tokens = $(el).tokenfield('getTokensList', '\t', false).trim()

  return tokens ? tokens.split('\t') : []
}
