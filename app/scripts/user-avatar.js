/**
 * Generic function to create an user "avatar"
 *
 * @param   {object|string} user - Numeric user ID or user object
 * @returns {string} HTML with the avatar (SPAN.avatar)
 */
module.exports = function userAvatar(user) {
  if (typeof user == 'string') {
    user = App.catalogs.elemFromId('users', user) || { name: '?' }
  }

  const title = user.name
  const sname = user.secondName || ' '

  const templ = `<span class="initials">${(title[0] + sname[0]).trim().toUpperCase()}</span>`

  return `<span class="avatar" title="${title}">${templ}</span>`
}
