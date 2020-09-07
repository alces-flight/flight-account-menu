import jwtDecode from 'jwt-decode';
import { combineReducers } from 'redux';
import pick from 'lodash/pick';
import lodash from 'lodash';

import apiRequest from "../../modules/apiRequest";
import loadingStates from '../loadingStates';
import registration from "../../modules/registration";
import { createModalReducer } from '../../utils/modals';

import * as actionTypes from './actionTypes';
import { FLIGHT_SSO_COOKIE, signOnStates } from "./constants";

const get = lodash.get;

const stateFromToken = (state, token) => {
  // Note: we make no attempt to validate the token here - we don't have access
  // to the shared secret in order to do so.
  // Validation is carried out server-side.
  const currentUser = token ? jwtDecode(token) : null;

  return {
    ...state,
    currentUser: currentUser,
    ssoToken: token
  };
};

const createDefaultState = (cookies) => {
  const ssoToken = cookies.get(FLIGHT_SSO_COOKIE);
  return {
    ...stateFromToken({}, ssoToken),
  };
};

const loginStateTransitions = {
  [actionTypes.SHOW_LOGIN_FORM]: signOnStates.FORM_SHOWING,
  [actionTypes.LOGIN]: signOnStates.SUBMITTING,
  [apiRequest.resolved(actionTypes.LOGIN)]: signOnStates.NOT_STARTED,
  [apiRequest.rejected(actionTypes.LOGIN)]: signOnStates.SIGN_ON_FAILED,
  [actionTypes.HIDE_LOGIN_FORM]: signOnStates.NOT_STARTED
};

const COOKIE_OPTIONS = {
  domain: (process.env.NODE_ENV === 'development') ? 'alces-flight.lvh.me' : 'alces-flight.com',
  path: '/'
};

const createUserAndSsoTokenReducer = (cookies) => (
  state=createDefaultState(cookies),
  action,
) => {
  switch (action.type) {
    case actionTypes.SET_SSO_TOKEN:
    case apiRequest.resolved(registration.actionTypes.REGISTER):
    case apiRequest.resolved(actionTypes.LOGIN):
    case apiRequest.resolved(actionTypes.CONFIRM_PASSWORD):
      const token = get(action, 'payload.token') ||
        get(action, 'payload.data.user.authentication_token');
      const newState = stateFromToken(state, token);

      if (newState.currentUser) {
        // Work around Chrome not setting cookie from AJAX request
        // (possibly only an issue in development)
        cookies.set(FLIGHT_SSO_COOKIE, token, {
          ...COOKIE_OPTIONS,
          expires: new Date(newState.currentUser.exp * 1000)
        });
      }
      return newState;

    case actionTypes.LOGOUT:
    case actionTypes.CLEAR_SSO_TOKEN:
      cookies.remove(FLIGHT_SSO_COOKIE, COOKIE_OPTIONS);
      return stateFromToken(state, null);

    default:
      return state;
  }
}

function signOnStateReducer(state={}, action) {
  switch (action.type) {
    case actionTypes.SHOW_LOGIN_FORM:
    case actionTypes.LOGIN:
    case apiRequest.resolved(actionTypes.LOGIN):
    case apiRequest.rejected(actionTypes.LOGIN):
    case actionTypes.HIDE_LOGIN_FORM:
      return {
        ...state,
        signOnState: loginStateTransitions[action.type]
      };

    default:
      return {
        ...state,
        signOnState: state.signOnState || signOnStates.NOT_STARTED,
      };
  }
}

const subReducers = {
  confirmPassword: combineReducers({
    modal: createModalReducer(
      actionTypes.CONFIRM_PASSWORD_MODAL_SHOWN,
      [
        actionTypes.CONFIRM_PASSWORD_MODAL_HIDDEN,
        apiRequest.resolved(actionTypes.CONFIRM_PASSWORD),
      ],
    ),
    meta: combineReducers({
      loadingState: loadingStates.reducer({
        pending: actionTypes.CONFIRM_PASSWORD,
        resolved: apiRequest.resolved(actionTypes.CONFIRM_PASSWORD),
        rejected: apiRequest.rejected(actionTypes.CONFIRM_PASSWORD),
      }),
    }),
  }),
};

function reduceReducers(...reducers) {
  return (state, action) =>
    reducers.reduce(
      (s, r) => r(s, action),
      state,
    );
}

// Lots of jiggery pockery here to combine the various reducers into a single
// reducer which preserving the original state structure.
//
// We could simplify this function, by updating all of our selectors and
// anywhere else that accesses this state slice to handle a different state
// structure.
function createReducer(cookies) {
  const mainReducer = reduceReducers(
    createUserAndSsoTokenReducer(cookies),
    signOnStateReducer,
  )
  const subReducer = combineReducers(subReducers);
  const subKeys = Object.keys(subReducers);
  return (state, action) => {
    const newMainState = mainReducer(state, action);
    const subState = pick(newMainState, subKeys);
    const newSubState = subReducer(subState, action);
    return {
      ...newMainState,
      ...newSubState,
    };
  };
}

export { createReducer };
