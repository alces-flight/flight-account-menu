import omit from 'lodash/omit';
import { maybeThrowSubmissionError } from "../jsonApi/actionUtils";

import constants from '../constants';

import * as actionTypes from './actionTypes';

export const hideSettingsModal = () => ({
  type: actionTypes.SETTINGS_MODAL_HIDDEN,
});

export const showSettingsModal = () => ({
  type: actionTypes.SETTINGS_MODAL_SHOWN,
});

export const hideConfirmationModal = () => ({
  type: actionTypes.CONFIRMATION_MODAL_HIDDEN,
});

export const showConfirmationModal = (emailUpdated) => ({
  type: actionTypes.CONFIRMATION_MODAL_SHOWN,
  meta: {
    emailUpdated,
  },
});

export function update(values, flightSsoUser) {
  const patches = values.changingPassword ?
    values :
    omit(
      values,
      ['changingPassword', 'password', 'passwordConfirmation', 'currentPassword']
    );

  return (dispatch, getState) => {
    const user = auth.selectors.currentUserSelector(getState());
    const emailUpdated = values.email !== user.email;
    const action = {
      type: actionTypes.UPDATE_REQUESTED,
      meta: {
        apiRequest: {
          config: {
            url: `${constants.ssoBaseURL}/accounts`,
            method: 'patch',
            headers: {
              "Content-Type": 'application/json'
            },
            data: {
              account: patches,
              flightAppUrl: constants.FLIGHT_APP_URL,
            }
          }
        }
      }
    };

    return dispatch(action)
      .then(() => dispatch(hideSettingsModal()))
      .then(() => dispatch(showConfirmationModal(emailUpdated)))
      .catch(maybeThrowSubmissionError);
  };
}
