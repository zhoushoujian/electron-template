import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import reducer from '@/ducks';

const middleware = [thunk];
middleware.push(
  createLogger({
    collapsed: false,
  }),
);
const store = createStore(reducer, compose(applyMiddleware(...middleware)));
export const $dispatch = store.dispatch as any;
export const $getState = store.getState as any;
export default store;
