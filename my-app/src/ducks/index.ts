import { combineReducers } from 'redux';

import common from './common';

const reducersMap = {
  common: {
    common,
  },
};

export default combineReducers({
  ...Object.keys(reducersMap).reduce(
    (item, total) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      Object.assign({}, item, {
        [total]: (state, action) => {
          if (!state) {
            return Object.keys(reducersMap[total])
              .map(i => reducersMap[total][i](state, action))
              .reduce((prev, next) => Object.assign({}, prev, next), {});
          } else {
            Object.keys(reducersMap[total]).map(i => {
              // eslint-disable-next-line no-return-assign
              return (state = Object.assign({}, state, reducersMap[total][i](state, action)));
            });
            return state;
          }
        },
      }),
    {},
  ),
});
