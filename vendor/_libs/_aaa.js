/* eslint no-unused-vars:0 */

if (typeof Storage == 'undefined' ||
    typeof JSON != 'object' ||
    typeof requestAnimationFrame != 'function' ||
    ((document.documentMode || !-[1,]) | 0) ||          // IE
    ~navigator.userAgent.indexOf('Safari/') && Number('0b1') !== 1) {
  // Safari 9+ supports binary notation
  window.location.href = 'upgrade.html'
}

try {
  if (window.self !== window.top) window.top = window.self
} catch (_) {/**/}


// Polyfills/Helpers para fechas

Date.min = function (d1, d2) {
  return d1 && d2 ? (+d1 <= +d2 ? d1 : d2) : (d1 || d2)
}

Date.max = function (d1, d2) {
  return d1 && d2 ? (+d1 >= +d2 ? d1 : d2) : (d1 || d2)
}

;(function (DP) {
  if (!DP.toJSON) DP.toJSON = DP.toISOString
})(Date.prototype)

function getById(id) {
  return id ? document.getElementById(id[0] === '#' ? id.slice(1) : id) : null
}

// 10x faster than `$().hasClass`
function hasClass(el, cn) {
  var s = cn && el && el.className
  if (s) {
    if (typeof s != 'string') {
      s = el.getAttribute('class') || ''  // may be SVG
    }
    for (var n = 0; ~(n = s.indexOf(cn, n)); n++) {
      if (!n || /\s/.test(s[n - 1])) {
        n += cn.length
        if (n === s.length || /\s/.test(s[n])) {
          return true
        }
      }
    }
  }
  return false
}
