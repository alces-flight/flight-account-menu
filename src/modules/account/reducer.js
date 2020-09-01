import { combineReducers } from 'redux';

import apiRequest from '../apiRequest';
import loadingStates from '../loadingStates';
import { createModalReducer } from '../../utils/modals';

import * as actionTypes from './actionTypes';

const metaReducers = combineReducers({
  loadingState: loadingStates.reducer({
    pending: actionTypes.UPDATE_REQUESTED,
    resolved: apiRequest.resolved(actionTypes.UPDATE_REQUESTED),
    rejected: apiRequest.rejected(actionTypes.UPDATE_REQUESTED),
  }),
});

const reducer = combineReducers({
  settings: createModalReducer(
    actionTypes.SETTINGS_MODAL_SHOWN, actionTypes.SETTINGS_MODAL_HIDDEN
  ),
  confirmation: createModalReducer(
    actionTypes.CONFIRMATION_MODAL_SHOWN, actionTypes.CONFIRMATION_MODAL_HIDDEN)
  ,
  meta: metaReducers,
});

export default reducer;
