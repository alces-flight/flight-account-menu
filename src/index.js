import Cookies from 'universal-cookie';
import React from 'react'
import styles from './styles.module.css'
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import createReducer from './reducer';

import auth from './modules/auth';
import apiRequest from './modules/apiRequest';

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

export const ExampleComponent = ({ text }) => {
  return (
    <Provider store={store}>
      <Menu text={text} />
    </Provider>
  );
}

function Menu({currentUser, dispatch, text}) {
  const nameRef = React.useRef(null);
  const passRef = React.useRef(null);

  const state = currentUser == null ?
    <span>not signed in</span> :
    <span>signed in as {currentUser.username}</span>;

  const form = currentUser == null ? (
    <React.Fragment>
      <label>
        Username:
        <input name="username" ref={nameRef} />
      </label>
      <label>
        Password:
        <input name="password" ref={passRef} type="password" />
      </label>
      <button onClick={() => {
        dispatch(auth.actions.login({ username: nameRef.current.value, password:  passRef.current.value}));
      }}>
        Login
      </button>
    </React.Fragment>
  ) : (
    <button onClick={() => {
      dispatch(auth.actions.logout());
    }}>
    Logout
  </button>
  );

  return (
    <div className={styles.test}>
      <div>
        You are {state}.
      </div>
      <div>
        {form}
      </div>
    </div>
  );
}
Menu = connect(
  createStructuredSelector({
    currentUser: auth.selectors.currentUserSelector
  }),
)(Menu);
