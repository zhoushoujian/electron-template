const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const commonConf = require('./common');

module.exports = merge(commonConf, {
  entry: ['webpack-hot-middleware/client?name=pure', path.join(__dirname, '../src/index.tsx'), 'antd/dist/antd.css'],
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BABEL_ENV': JSON.stringify('development'),
      isDev: 'development',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, '../public'),
    host: '0.0.0.0',
    useLocalIp: true,
  },
  target: 'web',
});
