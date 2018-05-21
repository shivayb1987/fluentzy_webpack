const path = require('path')
const webpack = require('webpack')
require("babel-polyfill")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const moment = require('moment')

// def
const pathBuild = (...paths) => path.join(__dirname, '..', 'dist', ...paths)
const pathSrc = (...paths) => path.join(__dirname, '..', 'src', ...paths)
const cssModuleScopedName = '[path]_[name]_[local]'
const jsEntry = pathSrc('index.jsx')
const timestamp = moment().format('DDMMYYYYhhmmss')
const packageJson = require('../package.json')
const dependencies = packageJson.dependencies
const depKeys = Object.keys(dependencies)
const excludeDependencies = ['falcon-ui-ib']
const updatedKeys = depKeys.filter(key => !excludeDependencies.includes(key))
// init config
const config = {
  context: pathSrc(),
  entry: {
    app: ["babel-polyfill", jsEntry],
    vendor: updatedKeys
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', pathSrc()]
  },
  module: {rules: []},
  plugins: [],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
    dns: 'empty'
  }
}

// ----------------------------------------------------------
// output
config.output = {
  path: pathBuild(),
  filename: 'assets/js/[name].[hash].js',
  sourceMapFilename: 'assets/js/[name].[hash].map',
  publicPath: '/',
  chunkFilename:'assets/js/[name].[hash].js'
}

// ----------------------------------------------------------
// rules
// handle js/jsx
config.module.rules.push({
  test: /\.jsx?$/,
  use: ['babel-loader']
})

// add rule to support images
config.module.rules.push({
  test: /\.(png|gif|jpe?g|svg)$/,
  loader: 'file-loader',
  options: {name: '[path]/[name].[ext]'}
})

// add rule to support font
config.module.rules.push({
  test: /\.(woff|woff2|eot|ttf)$/,
  use: [
    'url-loader?limit=100000'
  ]
})

// add rule to support css
config.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    `css-loader?importLoader=1`
  ]
})

// add rule to support json
config.module.rules.push({
  test: /\.(json)$/,
  use: [
    'json-loader'
  ]
})

// ----------------------------------------------------------
// plugins
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity,
  filename: 'assets/js/[name].[hash].js',
}))
// copy HTML entry file
config.plugins.push(new HtmlWebpackPlugin({
  filename: pathBuild('index.html'),
  template: pathSrc('index.html'),
  htmlVersion: `${process.env.NODE_ENV || 'PROD'}|${timestamp}|${packageJson.version}`,
  buildUser: `${process.env.username}`
}))

config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

// Specify the common bundle's name.
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'common'
}))
// define env
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
    'APP_SECRET': JSON.stringify(process.env.APP_SECRET),
    'APP_KEY': JSON.stringify(process.env.APP_KEY),
    'LINK_DOMAIN': JSON.stringify(process.env.LINK_DOMAIN)
  }
}))

// copy public folder
config.plugins.push(new CopyWebpackPlugin([{
    from: pathSrc('..', 'public'),
    to: pathBuild('public')
  }],
  {
    ignore: [
      '*.json'
    ],
}))

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  beautify: false,
  comments: false,
  warning: false,
  compress: {
    dead_code: true,
    drop_console: true,
    drop_debugger: true
  }
}))

module.exports = config
