import { combineReducers } from 'redux';

import apiRequest from '../apiRequest';
import { createModalReducer } from '../../utils/modals';

import * as actionTypes from './actionTypes';
import { registrationStages as stages, UNEXPECTED_ERROR } from "./constants";

const DEFAULT_STATE = stages.NOT_STARTED;

const nextStates = {
  [actionTypes.START_SIGN_UP]: stages.FORM_STARTED,
  [actionTypes.REGISTER]: stages.SUBMITTED,
  [apiRequest.resolved(actionTypes.REGISTER)]: stages.NOT_STARTED,
  [apiRequest.rejected(actionTypes.REGISTER)]: stages.FAILED,
  [actionTypes.CANCEL_SIGN_UP]: stages.NOT_STARTED,
};

const stateReducer = (state=DEFAULT_STATE, action) => {
  return nextStates[action.type] || state;
};

// Reducer to maintain the reason for registration failures.
function errorReducer(state=null, { type, error }) {
  switch (type) {
    case apiRequest.rejected(actionTypes.REGISTER):
      if (error.status === 0 || error.response.status === 500) {
        return UNEXPECTED_ERROR;
      } else {
        return null;
      }

    case apiRequest.resolved(actionTypes.REGISTER):
      return null;

    case actionTypes.CANCEL_SIGN_UP:
      return null;

    default:
      return state;
  }
}

export default combineReducers({
  state: stateReducer,
  error: errorReducer,
  welcomeMessage: createModalReducer(
    apiRequest.resolved(actionTypes.REGISTER),
    actionTypes.WELCOME_MESSAGE_HIDDEN,
  ),
});
