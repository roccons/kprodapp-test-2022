const dateToDBDate = require('scripts/lib/dates').dateToDBDate

const Filter = require('helpers/panel-filter')

class ReqFilter extends Filter {

  reset() {
    super.reset()
    this.data.from_date = null
    this.data.to_date = null
    this.data.script_storyboard = []

    if (App.user.has('PRODUCTOR_EDITORIAL')) {
      this.data.script_storyboard.push('0', '2')
    } else if (App.user.has('GUIONISTA')) {
      this.data.script_storyboard.push('1')
    }
  }

  getData() {
    const req = super.getData()
    let d1 = req.from_date
    let d2 = req.to_date

    delete req.from_date
    delete req.to_date

    if (d1 || d2) {
      if (d1 && d2 && +d1 > +d2) d1 = d2
      d1 = d1 ? dateToDBDate(d1) : null
      d2 = d2 ? dateToDBDate(d2) : null
      req.between = [d1, d2]
    }

    return req
  }
}

module.exports = function () {
  return new ReqFilter({
    tableKey: '#requisTable',
    template: require('./views/panel-filter.pug'),
    statuses_source: 'req_statuses',
  })
}
