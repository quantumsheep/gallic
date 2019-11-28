const path = require('path')

const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const is_dev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    gallic: ['./src/index.js', './styles/gallic.scss', './styles/gallic-theme-dark.scss'],
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `css/${is_dev ? '[name].css' : '[name].[hash].css'}`,
      chunkFilename: `css/${is_dev ? '[id].css' : '[id].[hash].css'}`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: is_dev,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
}
