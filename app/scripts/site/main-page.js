/*
  Creates the main page
*/
'use strict'

function checkUser(_routes) {
  const user = App.user

  _routes.menu = _routes.menu.filter(route => {
    const no = route.require && !user.has(route.require)
    if (no) {
      const section = route.section
      _routes.routes = _routes.routes.filter(r => r.section !== section)
    }
    return !no
  })
}

const $body  = $(document.body)
const $login = $('#user-login')

// Remove the login page if exists

if ($login.length) {
  $login.empty().remove()
}

$body.removeClass('login')

// folded: "site-menubar-fold site-menubar-keep"

const state = App.config.ls('menu-fold')

if (state) {
  $body.addClass(`site-menubar-${state} site-menubar-keep`)
}

// Create the DOM for the whole page

const routes = require('routes')
const conf   = require('config')
const page   = require('views/main.pug')

checkUser(routes)

$body.append(page(routes))

if (conf._ENVIRON !== 'PROD') {
  $('#site-navbar').addClass(`env env-${conf._ENVIRON}`)
}

if (conf._ISDEVEL && conf._ENVIRON === 'STG') {
  setImmediate(() => {
    $('#site-navbar-collapse')
      .append('<span class="badge env-extern">STG</span>')
      .find('h1').css('color', 'red')
  })
}
