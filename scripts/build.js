process.env.NODE_ENV = 'production'
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const config = require('../.webpack/webpack.prod')
const chalk = require('chalk')

console.log(chalk.blue('Generating minified bundle. This will take a moment...'))

webpack(config).run((error, stats) => {
  if (error) {
    console.log(chalk.red(error))
    return 1
  }

  const jsonStats = stats.toJson()
  fs.writeFile(path.join(__dirname, '/stats.json'), JSON.stringify(jsonStats), (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(chalk.red(error)))
  }

  if (jsonStats.hasWarnings) {
    console.log(chalk.error('Webpack generated the following warnings: '))
    jsonStats.warnings.map(warning => console.log(chalk.error(warning)))
  }

  // console.log(`Webpack stats: ${stats}`)

  console.log(chalk.green('Your app is compiled in production mode in /dist. It\'s ready to roll!'))

  return 0
})
