import { createSelector } from 'reselect';
import qs from 'query-string';

import { createModalSelector } from '../../utils/modals';

import { NAME } from './constants';

const accountRecoveryState = state => state[NAME];
const requestTokenState = state => accountRecoveryState(state).requestToken;
const resetPasswordState = state => accountRecoveryState(state).resetPassword;

export const requestToken = {
  stage: (state) => requestTokenState(state).stage,
  email: (state) => requestTokenState(state).email,
  errors: (state) => requestTokenState(state).errors,
  isModalOpen: createModalSelector(NAME, 'requestToken', 'modal'),
};

export const resetPassword = {
  stage: (state) => resetPasswordState(state).stage,
  errors: (state) => resetPasswordState(state).errors,
  isModalOpen: createModalSelector(NAME, 'resetPassword', 'modal'),
};

const tokenFromLocation = (location) => {
  if (location == null) {
    return null;
  }
  return qs.parse(location.search)['reset_password_token'];
};

export function tokenFromUrl(state) {
  return tokenFromLocation(window.location);
}
