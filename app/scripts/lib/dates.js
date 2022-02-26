/*
 * Rutinas de fechas
 */
'use strict'

const months = [
  'Enero', 'Febrero', 'Marzo',      'Abril',   'Mayo',      'Junio',
  'Julio', 'Agosto',  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const shortMonths = months.map((m) => m.slice(0, 3).toLowerCase())

const dateSep = '/'
const timeSep = ':'
const century = true
const smonths = shortMonths
const defzone = 'Z'
const emptyDS = '--'

// Leading zero for length 2
function _lz(n) {
  return (n |= 0) < 10 ? `0${n}` : n
}

function _fd(D) {
  if (!D) return null
  let y = D.getFullYear()

  if (!century) y = _lz(y % 100)
  return _lz(D.getDate()) + dateSep + smonths[D.getMonth()] + dateSep + y
}

/**
 * Convert UTC JS Date to local
 *
 * @param   {Date} local - Date in UTC time
 * @returns {Date} Date in local time
 */
function localToUTC(local) {
  return local && new Date(+local - local.getTimezoneOffset() * 60000)
}

/**
 * Ensures a JS Date or empty string if we don't have one
 *
 * @param   {*} v - Date as string, number, or Date object
 * @returns {Date|string} Date or empty string if we can't get a valid date
 */
function ensureDate(v) {
  if (!v) return null

  if (typeof v == 'number') {
    v = new Date(v)
  } else if (typeof v == 'string') {
    if (v.length === 10) {
      return dbDateToDate(v)
    }
    // yyyy-mm-dd hh:mm:ss
    if (v.length === 19) v += defzone
    v = new Date(v.replace(' ', 'T'))
  }

  return v instanceof Date && !isNaN(v) ? v : null
}

/**
 * Returns date in the format 'dd/mm/yyyy'
 *
 * @param   {Date}    D       - The date to format
 * @param   {boolean} [short] - true if remove century
 * @returns {string}  The formatted date, with century if required
 */
function dateFormat(D) {
  return _fd(ensureDate(D))
}

/**
 * Returns the time in the 'hh:mm' format.
 *
 * @param   {Date}   D - Date object with the time to format
 * @returns {string} Time as string in the required format
 */
function timeFormat(D) {
  D = ensureDate(D)

  return D ? _lz(D.getHours()) + timeSep + _lz(D.getMinutes()) : ''
}

/**
 * Returns the received date as string in the format 'dd/Mmm/yyyy hh:mm:ss'
 *
 * @param   {Date}   T      - Date object with the date to format
 * @param   {string} [sep]  - Separator between date and time
 * @returns {string} The formatted date-time.
 */
function dateTimeFormat(T, sep) {
  T = ensureDate(T)
  if (!T) return ''
  if (typeof sep != 'string') sep = ' '

  // eslint-disable-next-line prefer-template
  return _fd(T) + sep + _lz(T.getHours()) + timeSep + _lz(T.getMinutes())
}

/**
 * Returns the received date as string in the format 'dd/Mmm/yyyy'
 *
 * @param   {Date}   T - Date object with the date to format
 * @returns {string} The formatted date.
 */
function longDate(T) {
  T = ensureDate(T)
  if (!T) return emptyDS

  return `${T.getDate()}/${months[T.getMonth()]}/${T.getFullYear()}`
}

/**
 * Returns the received date as string in the format 'dd/Mmm/yyyy, hh:mm'
 *
 * @param   {Date}   T - Date object with the date to format
 * @returns {string} The formatted date-time.
 */
function longDateTime(T) {
  T = ensureDate(T)
  if (!T) return emptyDS

  return `${T.getDate()}/${months[T.getMonth()]}/${T.getFullYear()}, ${timeFormat(T)}`
}

/*
 * Server date (YYYY-MM-DD) to local JS Date
 */
function dbDateToDate(s) {
  const match = /^(\d{4})[./\-](\d\d)[./\-](\d\d)/.exec(s)
  return match && ~~match[1] && new Date(match[1], ~~match[2] - 1, match[3]) || NaN
}

/*
 * JS Date to server date : YYYY-MM-DD
 */
function dateToDBDate(s) {
  const d = ensureDate(s)
  return d && localToUTC(d).toISOString().slice(0, 10)
}

/*
 * JS Date to server datetime : YYYY-MM-DD HH:MM:SS
 */
function dateToDBDateTime(d) {
  d = ensureDate(d)
  return d && localToUTC(d).toISOString().slice(0, 19).replace('T', ' ')
}

function dateCompare(d1, d2) {
  if (d1 && !d1.setHours) d1 = ensureDate(d1)
  if (d2 && !d2.setHours) d2 = ensureDate(d2)
  if (d1 && d2) {
    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)
    return +d1 === +d2 ? 0 : +d1 > +d2 ? 1 : -1
  }
  return d1 ? 1 : -1
}

function minutesToHours(time) {
  if (time == null) return '--'
  const h = (time |= 0) / 60 | 0
  const m = time - h * 60

  const hm = h ? [`${h} hora${h !== 1 ? 's' : ''}`] : []
  if (m) hm.push(`${m} minutos`)

  return hm.length ? hm.join(', ') : '0'
}

/**
 * Get the differente in milliseconds|seconds|minutes|hours between two dates
 * If params is null it will be "NOW"
 *
 * @param {string} dateOlder format: "YYYY-MM-DD HH:MM:SS" || null
 * @param {string} dateNewer format: "YYYY-MM-DD HH:MM:SS" || null
 * @param {string} opt ms|seg|min|hr
 * @returns {float} dif
 */
function getDateDiff(dateOlder, dateNewer, opt) {

  const d1 = dateOlder ? new Date(dateOlder) : new Date()
  const d2 = dateNewer ? new Date(dateNewer) : new Date()
  const dif = d1 - d2

  switch (opt) {
    case 'sec':
      return (dif / 1000).toFixed(4)
    case 'min':
      return (dif / 60000).toFixed(4)
    case 'hr':
      return (dif / 3600000).toFixed(4)
    default:
      return dif
  }
}

module.exports = {
  dateFormat,
  timeFormat,
  dateTimeFormat,
  longDate,
  longDateTime,
  dbDateToDate,
  dateToDBDate,
  dateToDBDateTime,
  localToUTC,
  dateCompare,
  minutesToHours,
  ensureDate,
  months,
  shortMonths,
  getDateDiff
}
