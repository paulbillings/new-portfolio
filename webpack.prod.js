const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const path = require('path');
const CopyFolderPlugin = require('./copy-folder-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Standalone pages copied as-is, served at /<path> (e.g. /wrenford-rescue/privacy)
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
      inject: false,
      minify: false
    })
);

// Perfect Parcel: player landing page at /perfect-parcel, press kit at
// /perfect-parcel/press, with their images, video and zip
const pressKit = [
  new HtmlWebpackPlugin({
    template: './src/perfect-parcel/index.html',
    filename: 'perfect-parcel/index.html',
    inject: false,
    minify: false
  }),
  new HtmlWebpackPlugin({
    template: './src/perfect-parcel/press.html',
    filename: 'perfect-parcel/press/index.html',
    inject: false,
    minify: false
  }),
  new CopyFolderPlugin(
    path.resolve(__dirname, 'src/perfect-parcel/press'),
    'perfect-parcel/press'
  )
];

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contentHash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
      new HtmlWebpackPlugin({
        template: './src/template.html',
        favicon: './src/assets/favicon.png',
        // The home page is self-contained (inline CSS, JS and images)
        inject: false,
        minify: false
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash].css'
    }),
    ...staticPages,
    ...pressKit,
    // Files served from the site root, e.g. /app-ads.txt for AdMob
    new CopyFolderPlugin(path.resolve(__dirname, 'src/root'), '')
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, //3. Extract css into files
          'css-loader', //2. Turns css into commonjs
          'sass-loader'
        ] //1. Turns sass into css
      }
    ]
  }
});
