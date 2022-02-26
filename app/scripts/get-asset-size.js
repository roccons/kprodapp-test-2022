module.exports = function (src) {
  const xhr = new XMLHttpRequest()
  xhr.open('HEAD', src, true)
  xhr.setRequestHeader('Accept-Encoding', 'deflate')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        //promise.resolve('Size in bytes: ' + xhr.getResponseHeader('Content-Length'))
      }
      //promise.reject('ERROR')
    }
  }
  xhr.send(null)
}
