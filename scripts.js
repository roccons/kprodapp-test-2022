const readline = require('readline')
const args = process.argv[2]
const successColor = '\x1b[37m\x1b[42m%s\x1b[0m'
const infoColor = '\x1b[37m\x1b[34m%s\x1b[0m'
const warningColor = '\x1b[31m\x1b[43m%s\x1b[0m'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(q, cb) {
  rl.question(`${q} [si/no] \n`, answer => {
    if (answer === 'si') {
      rl.close()
      if (typeof cb === 'function') cb()
    } else {
      throw new Error('Operación cancelada')
    }
  })
  // Escucha [Ctrl + C]
  // Si no se especifica ejecuta rl.close() lo que equivale a decir 'SI'
  rl.on('SIGINT', () => {
    throw new Error('Operación cancelada')
  })
}

/* deploy a staging * */
if (args === 'predeploy') {
  console.log(infoColor, 'Deploy a staging')
  question('¿Continuar con el deploy de KPROD a staging?', () => {
    console.log(infoColor, 'Deploying KPROD staging...')
  })
}

if (args === 'postdeploy') {
  console.log(successColor, 'KPROD Staging actualizado')
  /* eslint-disable-next-line no-process-exit, unicorn/no-process-exit */
  process.exit()
}

/* deploy a producción * */
if (args === 'predeploypro') {
  console.log(warningColor, '** ¡DEPLOY A PRODUCCIÓN! **')
  question('¿Continuar con el deploy de KPROD a producción?', () => {
    console.log(infoColor, 'Deploying KPROD Production...')
  })
}

if (args === 'postdeploypro') {
  console.log(successColor, 'KPROD producción actualizado')
  /* eslint-disable-next-line no-process-exit, unicorn/no-process-exit */
  process.exit()
}
