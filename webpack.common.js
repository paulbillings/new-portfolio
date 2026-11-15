const Webpack = require('webpack');
const fs = require('fs');
const path = require('path');

// The home page's photos and scene layers, served as-is at /assets/<file>
class CopyHomeAssets {
  apply(compiler) {
    const dir = path.resolve(__dirname, 'src/home');
    compiler.hooks.emit.tap('CopyHomeAssets', compilation => {
      fs.readdirSync(dir).forEach(file => {
        const data = fs.readFileSync(path.join(dir, file));
        compilation.assets[`assets/${file}`] = {
          source: () => data,
          size: () => data.length
        };
      });
    });
  }
}
module.exports = {
  entry: {
    vendor: './src/vendor.js',
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets'
            },
          },
        ],
      },
    ],
  },
  // This config allows to use jQuery $ sign
  plugins: [
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CopyHomeAssets()
  ]
}