module.exports = function encode(s) {
  return s ? String(s)
    .replace(/<br>/g, '\n')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>') : ''
}
