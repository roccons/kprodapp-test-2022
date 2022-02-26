function assign (dest) {
  var args = arguments
  if (dest == null) {
    dest = {}
  }
  dest = Object(dest)
  for (var i = 1; i < args.length; i++) {
    var src = args[i]
    if (src) {
      var j, p, keys = Object.keys(Object(src))
      for (j = 0; j < keys.length; j++) {
        p = keys[j]
        dest[p] = src[p]
      }
    }
  }
  return dest
}
