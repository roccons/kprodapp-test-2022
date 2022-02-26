module.exports = function (n) {
  n = Number(n)
  if (isNaN(n)) return 0
  const num = n.toFixed(2)
  if (num.slice(-2) === '00') return num.split('.')[0]
  return num.slice(-1) === '0' ? num.slice(0, -1) : num
}
