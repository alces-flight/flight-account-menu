import { combineReducers } from 'redux';
import lodash from 'lodash';

import apiRequest from '../apiRequest';
import { createModalReducer } from '../../utils/modals';

import {
  REQUEST_TOKEN_MODAL_HIDDEN,
  REQUEST_TOKEN_MODAL_SHOWN,
  RESET_PASSWORD_MODAL_HIDDEN,
  RESET_PASSWORD_MODAL_SHOWN,
  PASSWORD_RESET_REQUESTED,
  RESET_PASSWORD_TOKEN_REQUESTED,
} from './actionTypes';

const { get } = lodash;

function requestTokenEmailReducer(state=null, { type, meta }) {
  switch (type) {
    case RESET_PASSWORD_TOKEN_REQUESTED:
      return meta.email;
    default:
      return state;
  }
};

function requestTokenStageReducer(state='INITIATED', { type }) {
  switch (type) {
    case REQUEST_TOKEN_MODAL_SHOWN:
      return 'INITIATED';
    case RESET_PASSWORD_TOKEN_REQUESTED:
      return 'SUBMITTING';
    case apiRequest.resolved(RESET_PASSWORD_TOKEN_REQUESTED):
      return 'RESOLVED';
    case apiRequest.rejected(RESET_PASSWORD_TOKEN_REQUESTED):
      return 'REJECTED';
    default:
      return state;
  }
};

function requestTokenErrorsReducer(state=null, { type, error }) {
  switch (type) {
    case REQUEST_TOKEN_MODAL_SHOWN:
    case RESET_PASSWORD_TOKEN_REQUESTED:
    case apiRequest.resolved(RESET_PASSWORD_TOKEN_REQUESTED):
      return null;
    case apiRequest.rejected(RESET_PASSWORD_TOKEN_REQUESTED):
      return get(error, 'response.data.errors.reset_password_token') || null;
    default:
      return state;
  }
};

function resetPasswordStageReducer(state='INITIATED', { type }) {
  switch (type) {
    case RESET_PASSWORD_MODAL_SHOWN:
      return 'INITIATED';
    case PASSWORD_RESET_REQUESTED:
      return 'SUBMITTING';
    case apiRequest.resolved(PASSWORD_RESET_REQUESTED):
      return 'RESOLVED';
    case apiRequest.rejected(PASSWORD_RESET_REQUESTED):
      return 'REJECTED';
    default:
      return state;
  }
};

function resetPasswordErrorsReducer(state=null, { type, error }) {
  switch (type) {
    case RESET_PASSWORD_MODAL_SHOWN:
    case PASSWORD_RESET_REQUESTED:
    case apiRequest.resolved(PASSWORD_RESET_REQUESTED):
      return null;
    case apiRequest.rejected(PASSWORD_RESET_REQUESTED):
      return get(error, 'response.data.errors.reset_password_token') || null;
    default:
      return state;
  }
};

const reducer = combineReducers({
  requestToken: combineReducers({
    email: requestTokenEmailReducer,
    errors: requestTokenErrorsReducer,
    modal: createModalReducer(
      REQUEST_TOKEN_MODAL_SHOWN, REQUEST_TOKEN_MODAL_HIDDEN
    ),
    stage: requestTokenStageReducer,
  }),
  resetPassword: combineReducers({
    errors: resetPasswordErrorsReducer,
    modal: createModalReducer(
      RESET_PASSWORD_MODAL_SHOWN, RESET_PASSWORD_MODAL_HIDDEN
    ),
    stage: resetPasswordStageReducer,
  }),
});

export default reducer;
