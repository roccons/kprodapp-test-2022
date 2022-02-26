// Se accede directo con store2 ya que esto se ejecuta antes de inicializar App.
const store2 = require('store2')

const SECONDS = 12                    // segundos entre cambio de imagen del login
const MAX_IDX = 14                    // máximo nombre de imágenes, base '1'
const MEM_KEY = 'imageCycleIndex'     // key for log info in window.localStorage
const IMG_URI = 'https://stg-knotion-resources.s3-us-west-2.amazonaws.com/knotion'

const _state = {
  timer: 0,
  index: ~~store2(MEM_KEY), // usará la imagen siguiente de la última usada
  on: false,
}

/**
 * Remueve las imágenes del contenedor de `img`, excluyendo ésta.
 * @param {*} img - Imagen a excluir de la remoción.
 */
const _remove = img => {
  if (_state.on && img.parentElement) {
    const children = img.parentElement.querySelectorAll('img') || []
    let ix = children.length

    while (--ix >= 0) {
      if (children[ix] !== img) {
        children[ix].remove()
      }
    }
  }
}

/**
 * Muestra la imágen tras una carga exitosa.
 * @param {*} evt - Evento `load`
 */
const _show = evt => {
  /** @type {HTMLImageElement} */
  const img = evt.currentTarget
  img.classList.add('show')

  // Remueve las imágenes después de 1 segundo, excepto la actual
  setTimeout(_remove, 1000, img)
}

/**
 * Detiene la muestra de las imágenes
 */
const stop = () => {
  // Deshabilita el flag de activación
  _state.on = false

  // Cancela cualquier timer en cuerso
  clearTimeout(_state.timer)
  setTimeout(() => {
    // Durante el timeout, se pudieron habilitar de nuevo
    // las imágenes de fondo, verificar de nuevo.
    if (!_state.on) {
      $('#image-slider').remove()
    }
  }, 250) // Da tiempo que termine cualquier animación, ej. el fade-out
}

/**
 * Cicla las imágenes de fondo
 */
const cycle = () => {
  // Obtiene o crea el DIV de las imágenes
  const element = getById('image-slider')
  if (!element) {
    return
  }

  let idx = ++_state.index
  if (idx > MAX_IDX) {
    idx = 1
    _state.index = 0
  }

  // Lo guarda en memoria permanente
  store2(MEM_KEY, _state.index)

  const image = new Image()
  element.appendChild(image)

  image.addEventListener('load', _show)
  image.classList.add('main-cover')
  image.src = `${IMG_URI}/${idx}.jpg`

  image.timer = setTimeout(cycle, 1000 * SECONDS)
}

/**
 * Inicia la muestra de las imágenes de fondo
 */
const start = () => {
  _state.on = true // pone el flag de activación

  if (!getById('image-slider')) {
    $(document.body).append('<div id="image-slider"/>')
  }
  $(document.body).children('.loader-default').removeClass('loader-default')

  cycle()
}

module.exports = {
  start,
  stop,
}
