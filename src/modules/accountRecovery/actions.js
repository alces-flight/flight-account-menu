import constants from '../constants';

import * as actionTypes from './actionTypes';

export const startAccountRecovery = () => ({
  type: actionTypes.REQUEST_TOKEN_MODAL_SHOWN,
});

export const hideRequestTokenModal = () => ({
  type: actionTypes.REQUEST_TOKEN_MODAL_HIDDEN,
});

export const hideResetPasswordModal = () => ({
  type: actionTypes.RESET_PASSWORD_MODAL_HIDDEN,
});

export const showResetPasswordModal = () => ({
  type: actionTypes.RESET_PASSWORD_MODAL_SHOWN,
});

export function resetPassword({ password, passwordConfirmation, token }) {
  return (dispatch) => {
    const action = {
      type: actionTypes.PASSWORD_RESET_REQUESTED,
      meta: {
        apiRequest: {
          config: {
            url: `${constants.ssoBaseURL}/reset-password`,
            method: 'PUT',
            params: {
              'account[password]': password,
              'account[password_confirmation]': passwordConfirmation,
              'account[reset_password_token]': token,
            }
          }
        }
      }
    };
    return dispatch(action)
      // .then(() => {
      //   dispatch(push({ search: '' }));
      // })
      .catch((e) => {
        console.log('e:', e);  // eslint-disable-line no-console
        // dispatch(push({ search: '' }));
        return e;
      });
  };
}

export function requestToken({ email }) {
  const action = {
    type: actionTypes.RESET_PASSWORD_TOKEN_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          url: `${constants.ssoBaseURL}/request-password-reset`,
          method: 'POST',
          params: {
            'account[email]': email,
            flightAppUrl: constants.FLIGHT_APP_URL,
          }
        }
      },
      email,
    },
  };
  return action;
}
