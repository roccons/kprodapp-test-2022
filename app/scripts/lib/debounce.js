/**
 * From underscore.js debounce function.
 *
 * Returns a function, that, as long as it continues to be invoked,
 * will not be triggered. The function will be called after it stops
 * being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge,
 * instead of the trailing.
 *
 * @param   {function} func - The function to be invoked
 * @param   {number}   wait - Ellapsed milliseconds to allow another execution
 * @param   {boolean} [immediate] - True to trigger the function now
 * @returns {function} The debounced function.
 */
module.exports = function debounce(func, wait, immediate) {
  let timeout, args, context, result

  const noop = function () {
    timeout = 0
  }

  const later = function () {
    timeout = 0
    result  = func.apply(context, args)
    context = args = null
    timeout = timeout || setTimeout(noop, wait)
  }

  return function () {
    /* eslint consistent-this:0 */
    context = this
    args = arguments

    // honor `immediate` only if nothing to execute at this time
    if (immediate && !timeout) {
      func.apply(context)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }

    return result
  }
}
