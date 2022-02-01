/* eslint-disable no-console */
const express = require('express');
const webpack = require('webpack');
const openBrowser = require('react-dev-utils/openBrowser');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConf = require('./webpack/dev');

// 设置运行环境
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

const app = express();

const compiler = webpack(webpackConf);
const { publicPath } = webpackConf.output;

app.use(webpackDevMiddleware(compiler, { stats: { colors: true, cached: false }, publicPath }));
app.use(webpackHotMiddleware(compiler));

const port = 9999;
// const host = '172.18.53.229';
const host = '0.0.0.0';

app.listen(port, host, err => {
  if (err) {
    console.error('服务器启动异常');
    throw err;
  }
  const url = `http://localhost:${port}/index.html`;
  console.info('服务地址：', url);

  openBrowser(url);
});

process.on('uncaughtException', err => {
  console.error('uncaughtException err', err);
  throw new Error(err);
});

process.on('unhandledRejection', err => {
  console.error('unhandledRejection err', err);
  throw new Error(err);
});

module.exports = app;
