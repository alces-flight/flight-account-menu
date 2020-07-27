import { combineReducers } from 'redux';

import { createModalReducer } from '../../utils/modals';

import * as actionTypes from './actionTypes';

const reducer = combineReducers({
  settings: createModalReducer(
    actionTypes.SETTINGS_MODAL_SHOWN, actionTypes.SETTINGS_MODAL_HIDDEN
  ),
  confirmation: createModalReducer(
    actionTypes.CONFIRMATION_MODAL_SHOWN, actionTypes.CONFIRMATION_MODAL_HIDDEN)
  ,
});

export default reducer;
