process.env.NODE_ENV = 'production'
const webpack = require('webpack')
const analyze = require('webpack-bundle-analyzer')
const config = require('../.webpack/webpack.prod')

config.plugins.push(new analyze.BundleAnalyzerPlugin())
config.plugins.push(new analyze.BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: 'report.html',
  openAnalyzer: true
}))

const compiler = webpack(config)

compiler.run((error, stats) => {
  if (error) {
    throw new Error(error)
  }

  console.log(stats) // eslint-disable-line no-console
})
