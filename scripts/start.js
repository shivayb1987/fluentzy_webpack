process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const config = require('../.webpack/webpack.dev')
const createDevServerConfig = require('../.webpack/webpack.devServerConfig')
const appPackageJson = require('../package.json')

const appPublic = (...paths) => path.join(__dirname, '..', 'public', ...paths)
const isInteractive = process.stdout.isTTY

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      return
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const appName = appPackageJson.name
    const urls = prepareUrls(protocol, HOST, port)
    const compiler = createCompiler(webpack, config, appName, urls, false)
    const proxySetting = appPackageJson.proxy
    const proxyConfig = prepareProxy(proxySetting, appPublic())
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    )
    const devServer = new WebpackDevServer(compiler, serverConfig)
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err)
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log(chalk.cyan('Starting the development server...\n'))
      openBrowser(urls.localUrlForBrowser)
    })
    process.on('SIGINT', function () {
      devServer.close()
      process.exit()
    })
    process.on('SIGTERM', function () {
      devServer.close()
      process.exit()
    })
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })
