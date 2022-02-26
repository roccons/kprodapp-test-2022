/*
  Objeto donde la llave es el nombre de grado y el valor es su código
  de 2 caracteres alfanuméricos.
 */
const cat = App.catalogs.get('grades')
const _gradeKey = {}

cat.forEach(c => { _gradeKey[c.name] = c.id })

module.exports = function gradeKey(grade) {
  return grade && _gradeKey[grade.trim()]
}
