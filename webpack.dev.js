const path = require('path')
const webpack = require('webpack')
require("babel-polyfill")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// def
const pathBuild = (...paths) => path.join(__dirname, '..', 'dist', ...paths)
const pathSrc = (...paths) => path.join(__dirname, '..', 'src', ...paths)
const cssModuleScopedName = '[path]_[name]_[local]'
const jsEntry = pathSrc('index.jsx')

// init config
const config = {
  context: pathSrc(),
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      'react-dev-utils/webpackHotDevClient',
      jsEntry
    ],
    vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux', 'redux-act', 'redux-saga', 'redux-promise', 'redux-form']
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
  filename: 'assets/js/[name].js',
  sourceMapFilename: 'assets/js/[name].map',
  chunkFilename: 'assets/js/[chunkhash].js',
  publicPath: '/'
}

// ----------------------------------------------------------
config.devtool = 'cheap-module-source-map'
// ----------------------------------------------------------
// rules
// handle js/jsx
config.module.rules.push({
  test: /\.jsx?$/,
  use: ['babel-loader']
})

// add rule to support images & fonts
config.module.rules.push({
  test: /\.(png|gif|jpe?g|svg|woff|woff2|eot|ttf)$/,
  // test: /\.(png|gif|jpe?g|svg)$/,
  loader: 'file-loader',
  options: {name: '[path]/[name].[ext]'}
})

// add rule to support css
config.module.rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    `css-loader?importLoader=1`
  ]
})

config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

// config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
//   name: 'vendor',
//   minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
// }))

// Specify the common bundle's name.
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
  name: 'common'
}))

config.plugins.push(new webpack.HotModuleReplacementPlugin())

// add rule to support json
config.module.rules.push({
  test: /\.(json)$/,
  use: [
    'json-loader'
  ]
})

// ----------------------------------------------------------
// plugins
// show named module of hot reload
config.plugins.push(new webpack.NamedModulesPlugin())


// copy HTML entry file
config.plugins.push(new HtmlWebpackPlugin({
  filename: pathBuild('index.html'),
  template: pathSrc('index.html'),
  htmlVersion: 'DEV'
}))


// define env
config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"dev"',
    'LINK_DOMAIN': JSON.stringify(process.env.LINK_DOMAIN) || '"https://dbsweb-s01-www.dbs.com"'
  }
}))

// copy public folder
config.plugins.push(new CopyWebpackPlugin([{
  from: pathSrc('..', 'public'),
  to: pathBuild('public')
}]))

config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

module.exports = config
