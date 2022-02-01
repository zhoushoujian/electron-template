// 设置运行环境
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const commonConf = require('./common');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(
  merge(commonConf, {
    entry: [path.join(__dirname, '../src/index.tsx'), 'antd/dist/antd.css'],
    mode: 'production',
    devtool: 'hidden-source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BABEL_ENV': JSON.stringify('production'),
      }),
      new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            beautify: false, //是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，可以设置为false
            comments: false, //不保留代码中的注释，默认为保留，为了达到更好的压缩效果
          },
          warnings: false,
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
        },
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '../public/64x64.png'),
          to: path.join(__dirname, '../build/64x64.png'),
        },
        {
          from: path.join(__dirname, '../public/favicon.ico'),
          to: path.join(__dirname, '../build/favicon.ico'),
        },
      ]),
    ],
  }),
);
