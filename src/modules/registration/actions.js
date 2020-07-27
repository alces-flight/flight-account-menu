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
              "Content-Type": 'application/json'
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

export const showTermsModal = () => ({
  type: actionTypes.TERMS_SHOWN,
});

export const hideTermsModal = () => ({
  type: actionTypes.TERMS_HIDDEN,
});

export const showPrivacyPolicyModal = () => ({
  type: actionTypes.PRIVACY_POLICY_SHOWN,
});

export const hidePrivacyPolicyModal = () => ({
  type: actionTypes.PRIVACY_POLICY_HIDDEN,
});

export const hideWelcomeMessageModal = () => ({
  type: actionTypes.WELCOME_MESSAGE_HIDDEN,
});
