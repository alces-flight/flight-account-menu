import lodash from 'lodash';

import apiRequest from '../apiRequest';

import * as actionTypes from './actionTypes';
import { confirmationStages } from "./constants";

const { get } = lodash;
const { resolved, rejected } = apiRequest;

const DEFAULT_STATE = {
  stage: confirmationStages.NOT_STARTED,
  error: null,
  confirmedEmailChange: null,
};

const nextStates = {
  [actionTypes.SUBMIT_CONFIRMATION]: confirmationStages.SUBMITTED,
  [resolved(actionTypes.SUBMIT_CONFIRMATION)]: confirmationStages.SUCCEEDED,
  [rejected(actionTypes.SUBMIT_CONFIRMATION)]: confirmationStages.FAILED,
  [actionTypes.CLOSE_DIALOG]: confirmationStages.NOT_STARTED
};

export default (state=DEFAULT_STATE, action) => {
  const nextStage = nextStates[action.type] || state.stage;
  let error = state.error;
  let confirmedEmailChange = state.confirmedEmailChange;

  if (action.type === rejected(actionTypes.SUBMIT_CONFIRMATION) && action.error) {
    error = action.error.response.data;
  }

  if (action.type === resolved(actionTypes.SUBMIT_CONFIRMATION)) {
    confirmedEmailChange = get(action, 'meta.previousAction.meta.confirmedEmailChange');
  }

  return {
    stage: nextStage,
    error: error,
    confirmedEmailChange: confirmedEmailChange,
  };
};
