const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');


const isProd = (process.env.NODE_ENV === 'production');
const isDev = !isProd;


console.log(process.env.NODE_ENV);
// console.log('isDev ', isDev);
// console.log('isProd ', isProd);

const filename = (ext) => {
  return isProd ? `bundle.[hash].${ext}` : `bundle.${ext}`
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: isDev,
    port: 3000,
    open: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),

    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')},
      ],
    }),

    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),

    new ESLintPlugin({}),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}

// const jsLoaders = () => {
//   const loaders = [{
//     loader: 'babel-loader',
//     options: {
//       presets: ['@babel/preset-env'],
//     },
//   }]
//
//   if (isDev) loaders.push('eslint-loader')
//
//   return loaders;
// }
