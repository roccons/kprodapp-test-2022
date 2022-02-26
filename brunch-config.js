const values = require('./app/values')

module.exports = {
  files: {
    javascripts: {
      joinTo: 'js/app.js',
      order: {
        before: [
          'vendor/screenfull.js',
          'vendor/A_remark/core.js',
          'vendor/colors.js'
        ]
      }
    },
    stylesheets: {
      joinTo: 'css/app.css'
    },
    templates: {
      joinTo: 'js/app.js'
    }
  },
  plugins: {
    jscc: {
      values: values,
      pattern: /\.(jsx?|pug)$/,
      sourceMap: true,
      sourceMapFor: /\.(jsx?|pug)$/
    },
    buble: {
      target: { chrome: 48, firefox: 48, edge: 13 },
      objectAssign: 'assign',
      jsx: 'h'
    },
    pug: {
      globals: ['App', 'assign', 'getById', 'hasClass', '$_REQ_ST', '$_ORDER_ST', '$_TASK_ST'],
      preCompile: true,
      preCompilePattern: /\.html\.pug$/
    },
    eslint: {
      warnOnly: true
    },
    cleancss: {
      compatibility: 'ie11'
    },
    postIndex: {},
    uglify: {
      ecma: 6,
    }
  },
  // Sobrescribe configuración de modo "production"
  overrides: {
    production: {
      plugins: {
        autoReload: { enabled: false },
        eslint: { warnOnly: false },
      }
    },
  },
  // custom server port
  server: {
    run: true,
    port: 8080
  },
  watcher: {
    usePolling: true
  },
}
