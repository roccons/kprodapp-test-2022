'use strict'

const gradeKey = require('../boards/lib/grade-key')


// Funcion que determina el Team de acuerdo a el grado
function getTeam(team) {
  const level = team.charAt(0)

  // La "P" es de palvularia (El Salvador)
  if (level === 'K' || level === 'P') return 1
  if (level === 'E') {
    return parseInt(team.charAt(1), 10) <= 3 ? 2 : 3
  }
  if (level === 'M') return 4

  // Valores para grados de El Salvador
  // "Cycle 1" (primaria baja), "Cycle 2" (primaria alta) y "Cycle 3" (middle school),
  // devuelve el 3er carácter: 3C1 => 2
  if (team.includes('C')) {
    return Number(team.charAt(2)) + 1
  }
  return ''
}


module.exports = function urlFormatter(data) {
  let url

  if (data.model_type === 'order') { // nuevo formato
    const grade = data.grade && data.grade.trim()

    if (grade && data.challenge) {
      const team = getTeam(gradeKey(grade))
      url = `#/tablero/${team}/${data.challenge}?orden=${data.model_id}`
    } else {
      url = `#/orden/${data.model_id}`
    }

  } else if (data.url) {
    url = data.url
      .replace(/\/requisitions\/(?=\d)/, '#/requisicion/')
      .replace(/\/orders\/(?=\d)/, '#/orden/')
  }

  return url || false
}
