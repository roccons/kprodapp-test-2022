/**
 * Acorta el nombre de archivo para mejorar su visibilidad quitando del nombre
 * la clave de la orden, el id hexa agregado al final y convirtiendo los
 * guiones bajos a espacios.
 *
 * @param   {string} filename - Nombre de archivo a procesar
 * @returns {string} El nombre de archivo ya procesado.
 */
module.exports = function (filename) {

  const fpath = require('scripts/lib/fpath')
  const fname = fpath.justFname(filename)
  const match = /^\d+_(.*)_[a-fA-F0-9]{10,}(\.[a-zA-Z0-9]{2,5})$/.exec(fname)

  return match && match[1] + match[2] || fname
}
