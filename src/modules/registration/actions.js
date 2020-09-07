import constants from '../../modules/constants';
import { maybeThrowSubmissionError } from "../jsonApi/actionUtils";

import * as actionTypes from './actionTypes';

export const startSignUp = () => ({
  type: actionTypes.START_SIGN_UP
});

export function register(registrationData) {
  return (dispatch) => {
    const action = {
      type: actionTypes.REGISTER,
      meta: {
        apiRequest: {
          config: {
            url: `${constants.ssoBaseURL}/sign-up`,
            method: 'post',
            headers: {
              "Accept": 'application/vnd.api+json,application/json',
              "Content-Type": 'application/json',
            },
            data: {
              account: registrationData,
              flightAppUrl: constants.FLIGHT_APP_URL,
            },
            withCredentials: true,
          }
        }
      }
    };

    return dispatch(action)
      .catch(maybeThrowSubmissionError);
  };
}

export const cancelSignUp = () => ({
  type: actionTypes.CANCEL_SIGN_UP
});

export const hideWelcomeMessageModal = () => ({
  type: actionTypes.WELCOME_MESSAGE_HIDDEN,
});
