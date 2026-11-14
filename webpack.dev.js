const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const CopyFolderPlugin = require('./copy-folder-plugin');

const staticPages = [
  'wrenford-rescue/privacy',
  'wrenford-rescue/support',
  'perfect-parcel/privacy',
  'perfect-parcel/support'
].map(
  page =>
    new HtmlWebpackPlugin({
      template: `./src/${page}.html`,
      filename: `${page}/index.html`,
      inject: false
    })
);

// Perfect Parcel: player landing page at /perfect-parcel, press kit at
// /perfect-parcel/press, with their images, video and zip
const pressKit = [
  new HtmlWebpackPlugin({
    template: './src/perfect-parcel/index.html',
    filename: 'perfect-parcel/index.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    template: './src/perfect-parcel/press.html',
    filename: 'perfect-parcel/press/index.html',
    inject: false
  }),
  new CopyFolderPlugin(
    path.resolve(__dirname, 'src/perfect-parcel/press'),
    'perfect-parcel/press'
  )
];

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      favicon: './src/assets/favicon.png'
    }),
    ...staticPages,
    ...pressKit
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', //3. Inject styles into DOM
          'css-loader', //2. Turns css into commonjs
          'sass-loader'
        ] //1. Turns sass into css
      }
    ]
  }
});
