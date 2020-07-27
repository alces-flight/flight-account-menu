import { createSelector } from 'reselect';

import { createModalSelector, createModalDataSelector } from '../../utils/modals';

import { NAME, ssoTokenMaturity, ssoTokenExpirationLeaway } from './constants';

const authState = state => state[NAME];
const confirmPasswordModalData = createModalDataSelector(
  NAME, 'confirmPassword', 'modal'
);

function isSsoTokenExpired(ssoUser) {
  if (ssoUser == null) { return undefined; }
  const now = new Date().getTime() / 1000;
  return ssoUser.exp < now;
}

function isSsoTokenAboutToExpire(ssoUser) {
  if (ssoUser == null) { return undefined; }
  const now = new Date().getTime() / 1000;
  return ssoUser.exp - ssoTokenExpirationLeaway <= now;
}

export function currentUserSelector(state) {
  const currentUser = authState(state).currentUser;
  if (currentUser != null && !isSsoTokenExpired(currentUser)) {
    return currentUser;
  }
  return undefined;
};

export const currentUsernameSelector = createSelector(
  currentUserSelector,
  (currentUser) => currentUser && currentUser.username,
);

export const signOnStateSelector = createSelector(
  authState,
  (auth) => auth.signOnState
);

export const ssoToken = createSelector(
  authState,
  ssoTokenExpired,

  (auth, isExpired) => {
    if (isExpired) {
      return undefined;
    } else {
      return auth && auth.ssoToken;
    }
  },
);

export function ssoTokenExpired(state) {
  // We deliberately avoid using currentUserSelector to make sure that we get
  // the SSO user (decoded SSO token) even when it has expired.
  const ssoUser = authState(state).currentUser;
  return isSsoTokenExpired(ssoUser);
};

export function ssoTokenAboutToExpire(state) {
  // We deliberately avoid using currentUserSelector to make sure that we get
  // the SSO user (decoded SSO token) even when it has expired.
  const ssoUser = authState(state).currentUser;
  return isSsoTokenAboutToExpire(ssoUser);
};

// Is the SSO token older than `ssoTokenMaturity`.
//
// This does not necessarily mean that the SSO token is expired.  Use
// `ssoTokenExpired` for that.
export const ssoTokenMatured = (state) => {
  const ssoUser = currentUserSelector(state);
  if (ssoUser == null) { return undefined; }
  if (ssoUser.iat == null) { return true; }
  const now = new Date().getTime() / 1000;
  return ssoUser.iat + ssoTokenMaturity < now;
};

export const confirmPassword = {
  isModalOpen: createModalSelector(NAME, 'confirmPassword', 'modal'),
  manuallyDismissed: createSelector(
    confirmPasswordModalData,
    (data) => data.payload == null ? undefined : data.payload.manuallyDismissed,
  ),
  manuallyShown: createSelector(
    confirmPasswordModalData,
    (data) => data.payload == null ? undefined : data.payload.manuallyShown,
  ),
};
