import constants from '../constants';
import auth from '../../modules/auth';

import * as actionTypes from './actionTypes';

export const submitConfirmation = (token) => (dispatch, getState) => {
  // If we're confirming an email when we are already signed into flight SSO,
  // it must be an email change rather than a new account.
  const confirmedEmailChange = !!auth.selectors.currentUserSelector(getState());
  const action = {
    type: actionTypes.SUBMIT_CONFIRMATION,
    meta: {
      apiRequest: {
        config: {
          url: `${constants.ssoBaseURL}/confirm-email/${token}`,
          method: 'get'
        }
      },
      confirmedEmailChange,
    }
  };

  return dispatch(action).then(
    (response) => {
      return dispatch(auth.actions.setSSOToken(response.payload.data['authentication_token']));
    }
  );
};

export const closeDialog = () => ({
  type: actionTypes.CLOSE_DIALOG
});
