import { combineReducers } from 'redux';

import account from './modules/account';
import accountRecovery from './modules/accountRecovery';
import auth from './modules/auth';
import confirmation from './modules/confirmation';
import registration from './modules/registration';

const reducers = (cookies) => ({
  [account.constants.NAME]: account.reducer,
  [accountRecovery.constants.NAME]: accountRecovery.reducer,
  [registration.constants.NAME]: registration.reducer,
  [auth.constants.NAME]: auth.createReducer(cookies),
  [confirmation.constants.NAME]: confirmation.reducer,
});

const combinedReducers = (cookies, history) => combineReducers(reducers(cookies, history));

export default (cookies) => (state, action) =>
  combinedReducers(cookies)(state, action);
