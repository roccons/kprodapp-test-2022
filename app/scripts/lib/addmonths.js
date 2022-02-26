module.exports = function addMonths(date, count) {
  if (date && count) {
    const d = (date = new Date(+date)).getDate()

    date.setMonth(date.getMonth() + count, 1)
    const m = date.getMonth()
    date.setDate(d)
    if (date.getMonth() !== m) date.setDate(0)
  }
  return date
}
