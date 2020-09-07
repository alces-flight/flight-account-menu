import Cookies from 'universal-cookie';
import React from 'react'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';

import createLogics from './logics';
import createReducer from './reducer';

import apiRequest from './modules/apiRequest';
import Menu from './components/Menu';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const cookies = new Cookies();

export const store = createStore(
  createReducer(cookies),
  {},
  composeEnhancers(
    applyMiddleware(
      apiRequest.middleware,
      // createCookieMiddleware(cookies),
      thunk,
      // middleware,
    )
  )
);

createLogics(store);

export const AccountMenu = ({ signedInLinks }) => {
  return (
    <Provider store={store}>
      <Menu signedInLinks={signedInLinks} />
    </Provider>
  );
}
