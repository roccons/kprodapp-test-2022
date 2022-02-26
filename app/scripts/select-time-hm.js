
module.exports = function (name, time, tabidx) {
  'use strict'

  tabidx = tabidx ? ` tabindex="${tabidx}"` : ''

  const hrs = (time |= 0) / 60 | 0
  const mns = ((time - hrs * 60) / 5 | 0) * 5

  let selectHours = `<select class="form-control select-hm-time" id="${name}-hours"${tabidx}>`
  for (let h = 0; h < 24; h++) {
    selectHours += `<option value="${h}"${h === hrs ? ' selected' : ''}>${h}</option>`
  }
  selectHours += '</select>'

  let selectMinutes = `<select class="form-control select-hm-time" id="${name}-minutes"${tabidx}>`
  for (let m = 0; m < 60; m += 5) {
    selectMinutes += `<option value="${m}"${m === mns ? ' selected' : ''}>${m}</option>`
  }
  selectMinutes += '</select>'

  return { selectHours, selectMinutes }

}
