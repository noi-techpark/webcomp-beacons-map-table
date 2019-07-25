const defaultConfig = require('@open-wc/building-webpack/modern-config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(
  defaultConfig({
    input: './src/index.html'
  }),
  {
    mode: 'production',
    output: {
      path: path.resolve(__dirname + '/../../', 'dist'),
      filename: 'beacons-map-table.min.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: 'css-loader'
        },
        {
          test: /\.svg$/,
          use: 'svg-inline-loader'
        }
      ]
    }
  }
)