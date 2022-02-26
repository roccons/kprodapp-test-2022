module.exports = function (list) {
  let result = '<div class="tokenfield form-control readonly">'
  if (list && list.length) {
    result += list.map(s =>
      `<div class="token"><span class="token-label" style="max-width: 236px;">${
      s}</span><a class="close" tabindex="-1">×</a></div>`).join('')
  }
  return result + '</div>'
}
