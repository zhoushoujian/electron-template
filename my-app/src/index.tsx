import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import { axiosInterceptorsConfig } from '@/utils/common';
import store from '@/ducks/main';
import Routers from './router';

window.axios = axios.create({ baseURL: `/` });
window.getRoute = () => location.href.replace(/.+#/, '');
window.goRouteClass = (self: any, path: string) => self.props.history.push(path);
axiosInterceptorsConfig();

ReactDOM.render(
  <Provider store={store}>
    <Routers />
  </Provider>,
  document.getElementById('root'),
);
