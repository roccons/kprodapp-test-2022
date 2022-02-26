
module.exports = function setStatusClass(button, status) {
  const csList = button.classList

  for (let i = 0; i < csList.length; i++) {
    if (csList[i].slice(0, 3) === 'rq-') { //req
      csList.remove(csList[i])
      break
    }
  }
  csList.add('rq-' + status)
  button.setAttribute('data-id', status)
}
