import apiRequest from '../../modules/apiRequest';

import * as actionTypes from './actionTypes';
import constants from "../constants";

export const setSSOToken = (token) => ({
  type: actionTypes.SET_SSO_TOKEN,
  payload: {
    token: token
  }
});

export const clearSSOToken = () => ({
  type: actionTypes.CLEAR_SSO_TOKEN
});

export const logout = () => dispatch => {
  dispatch({ type: actionTypes.LOGOUT });
  dispatch(clearSSOToken());
};

export const showConfirmPasswordForm = ({ manuallyShown } = {}) => ({
  type: actionTypes.CONFIRM_PASSWORD_MODAL_SHOWN,
  payload: {
    manuallyShown,
  },
});

export const hideConfirmPasswordForm = ({ manuallyDismissed } = {}) => ({
  type: actionTypes.CONFIRM_PASSWORD_MODAL_HIDDEN,
  payload: {
    manuallyDismissed,
  },
});

export const showLoginForm = () => ({
  type: actionTypes.SHOW_LOGIN_FORM
});

export const hideLoginForm = () => ({
  type: actionTypes.HIDE_LOGIN_FORM
});

function loginAction(
  type,
  params,
  { permanent=false, withCredentials=true } = {},
) {
  return {
    type,
    meta: {
      apiRequest: {
        config: {
          url: `${constants.ssoBaseURL}/sign-in${permanent ? '?permanent=1' : ''}`,
          method: 'post',
          data: {
            account: params,
          },
          withCredentials: withCredentials,
        },
        skipAuthHeader: !withCredentials,
      }
    }
  };
}

function dispatchLoginAction(dispatch, action, { errorMessages }) {
  return dispatch(action)
    .catch(({ error }) => {
      const response = error.response;
      if (response && response.status === 401) {
        return Promise.reject(
          new apiRequest.SubmissionError({
            login: errorMessages.unauthorized,
            password: errorMessages.unauthorized,
          })
        );
      }
      return Promise.reject(error);
    });
}

export const confirmPassword = (data, user) => dispatch => {
  const params = {
    ...data,
    login: user.email,
  };
  const action = loginAction(
    actionTypes.CONFIRM_PASSWORD,
    params,
    {
      withCredentials: false,
      permanent: user.permanent
    }
  );
  action.meta = {
    ...action.meta,
    loadingState: {
      key: 'confirmPassword',
    },
  }

  return dispatchLoginAction(dispatch, action, {
    errorMessages: {
      unauthorized: 'Invalid password',
    }
  });
};

export const login = (data) => dispatch => {
  const { permanent, ...rest } = data;
  const action = loginAction(actionTypes.LOGIN, rest, { permanent });

  return dispatchLoginAction(dispatch, action, {
    errorMessages: {
      unauthorized: 'Invalid username or password',
    }
  });
};
