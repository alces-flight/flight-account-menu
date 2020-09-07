import Cookies from 'universal-cookie';
import React from 'react'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';

import createLogics from './logics';
import createReducer from './reducer';
import { Provider as ConfigProvider } from './ConfigContext';

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

export const AccountMenu = ({
  privacyPolicyUrl,
  signedInLinks,
  termsUrl,
}) => {
  return (
    <Provider store={store}>
      <ConfigProvider
        value={{
          privacyPolicyUrl: privacyPolicyUrl || "https://alces-flight.com/privacy",
          signedInLinks: signedInLinks || [],
          termsUrl: termsUrl || "https://alces-flight.com/terms",
        }}
      >
        <Menu />
      </ConfigProvider>
    </Provider>
  );
}
