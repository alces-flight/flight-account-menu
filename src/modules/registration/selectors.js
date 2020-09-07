import { createSelector } from 'reselect';
import qs from 'query-string';

import { createModalSelector } from '../../utils/modals';

import { NAME, UNEXPECTED_ERROR } from './constants';

export const registrationState = (state) => state[NAME].state;
export const isWelcomeMessageModalShowing = createModalSelector(NAME, 'welcomeMessage');
export const unexpectedFailure = (state) => state[NAME].error === UNEXPECTED_ERROR;

const emailFromLocation = (location) => {
  if (location == null) {
    return null;
  }
  const search = qs.parse(location.search);
  if (Object.keys(search).includes('signup')) {
    return search['email'];
  }
};

export function signupEmailFromUrl(state) {
  return emailFromLocation(window.location);
}
