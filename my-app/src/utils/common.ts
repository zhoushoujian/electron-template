/* eslint-disable no-console */
import { message } from 'antd';
import * as axiosPackage from 'axios';

const axiosPendingArr: { u: string; cancel: () => void }[] = [];
export const removePending = (config: { url: string; method: string }) => {
  for (const i in axiosPendingArr) {
    if (axiosPendingArr[i].u === config.url + '&' + config.method) {
      axiosPendingArr[i].cancel();
      axiosPendingArr.splice(Number(i), 1);
    }
  }
};

// axios拦截器配置
export const axiosInterceptorsConfig = () => {
  let currentDate = Date.now();
  let requestTimes = 0;
  let visitApiMoreTimes = false;
  let visitApiMoreTimesTimer: any = null;
  const CancelToken = (axiosPackage as any).CancelToken;
  window.axios.defaults.timeout = 10000;

  window.axios.interceptors.request.use(
    function (config) {
      removePending(config);
      config.cancelToken = new CancelToken(c => {
        axiosPendingArr.push({ u: config.url + '&' + config.method, cancel: c });
      });
      requestTimes++;
      if (requestTimes > 50) {
        if (Date.now() - currentDate > 10 * 1000) {
          currentDate = Date.now();
          requestTimes = 0;
        } else {
          console.error('more calls in short time, config', config);
        }
      }
      const token = localStorage.getItem('tk');
      if (token) {
        try {
          const tokenInfo = JSON.parse(token);
          config.headers.Authorization = tokenInfo.access_token;
          config.headers['collection-Name'] = localStorage.getItem('collectionName');
          config.headers['recent-Time'] = localStorage.getItem('recentTimeRecord');
        } catch (err) {
          console.error('axios.interceptors parse token err', err);
        }
      }
      return config;
    },
    function (err) {
      console.error('axios.interceptors.request err', err);
      return Promise.reject(err);
    },
  );

  window.axios.interceptors.response.use(
    response => {
      removePending(response.config);
      if (response) {
        if (response.data.result && response.data.result.token) {
          localStorage.setItem('tk', JSON.stringify(response.data.result.token));
        }
        return response.data.result;
      } else {
        console.error('axios.interceptors no response', response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('no response');
      }
    },
    error => {
      if (error && error.response) {
        if (!error.response.data) {
          console.error('axios.interceptors.response.use error.response', error.response);
        } else if (!error.response.data.result) {
          console.error('axios.interceptors.response.use error.response.data', error.response.data);
        } else if (error.response.data.result.errText === 'ip blocked') {
          console.error('axios.interceptors.response.use ip blocked');
          if (!visitApiMoreTimes) {
            message.error('您在短时间内访问服务器次数过多，请稍后重试');
            visitApiMoreTimes = true;
            return Promise.reject(error.response.data.result);
          } else {
            clearTimeout(visitApiMoreTimesTimer);
          }
          visitApiMoreTimesTimer = setTimeout(() => {
            visitApiMoreTimes = false;
          }, 2000);
        }
        if (error.response.data) {
          switch (error.response.status) {
            case 401:
              message.error('token已过期');
              location.replace(location.origin + '#/login');
              return Promise.reject(error.response.data.result);
            default:
              console.error(`error.response.data.result.errCode: ${error.response.data.result.errCode}`);
              break;
          }
        }
      }
      let response: any = {};
      if (error) {
        if (error.response) {
          if (error.response.data) {
            response = error.response.data;
          } else {
            response = error.response;
          }
        } else {
          response = error;
        }
      }

      if (error.response.status === 400) {
        message.error(response.result.errText);
      } else if (error.response.status === 500) {
        message.error('系统错误，请联系管理员');
      } else {
        message.error('未知错误');
        console.log('未知错误 response', response);
      }
      return Promise.reject(response); // 返回接口的错误信息
    },
  );
};

export const reportCallError = (err: any) => {
  if (err && err.result && err.result.errCode === 400) {
    message.error(err.result.errText);
  }
};

export const formatUrl = function (url: string, ...args: Array<number | string | any>) {
  if (!args.length) {
    return url;
  }
  const arg: string = typeof args[0];
  const target: any = arg === 'string' || arg === 'number' ? args : args[0];
  for (const i in target) {
    if (Object.prototype.hasOwnProperty.call(target, i)) {
      const replace = target[i] || '';
      url = url.replace(RegExp('\\{' + i + '\\}', 'gi'), replace);
    }
  }
  return url;
};

export const formatDate = (fmt: string, timestamp?: number) => {
  let self = new Date();
  if (timestamp) {
    self = new Date(timestamp);
  }
  const o = {
    'M+': self.getMonth() + 1, //月份
    'd+': self.getDate(), //日
    'h+': self.getHours(), //小时
    'm+': self.getMinutes(), //分
    's+': self.getSeconds(), //秒
    'q+': Math.floor((self.getMonth() + 3) / 3), //季度
    S: self.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (self.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

export const parseUrlParams = () => {
  const result: any = {};
  const search = location.href.split('?')[1];
  if (search) {
    const paramArr = search.split('&');
    paramArr.forEach(param => {
      const propArr = param.split('=');
      result[propArr[0]] = propArr[1];
    });
  }
  return result;
};

export const getFormatTime = time => {
  if (time < 1000) {
    return time + '毫秒';
  } else if (time >= 1000 && time < 1000 * 60) {
    return (time / 1000).toFixed(2) + '秒';
  } else if (time >= 1000 * 60 && time < 1000 * 60 * 60) {
    return (time / (1000 * 60)).toFixed(2) + '分';
  } else if (time >= 1000 * 60 * 60 && time < 1000 * 60 * 60 * 24) {
    return (time / (1000 * 60 * 60)).toFixed(2) + '小时';
  } else if (time >= 1000 * 60 * 60 * 24 && time < 1000 * 60 * 60 * 24 * 30) {
    return (time / (1000 * 60 * 60 * 24)).toFixed(2) + '天';
  } else if (time >= 1000 * 60 * 60 * 24 * 30 && time < 1000 * 60 * 60 * 24 * 30 * 12) {
    return (time / (1000 * 60 * 60 * 24 * 30)).toFixed(2) + '月';
  } else {
    return time + '毫秒';
  }
};
