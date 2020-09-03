import axios from 'axios';
import axiosMiddleware, { getActionTypes } from 'redux-axios-middleware';

// Import the selector directly instead of via the `auth` modules index.js to
// avoid a circular import reference.
import { ssoToken as ssoTokenSelector } from "../../modules/auth/selectors";

import { requestRejected, unexpectedError } from './actions';

function makeClient(options={}) {
  return axios.create({
    baseURL: '',
    responseType: 'json',
    headers: {
      Accept: [
        'application/vnd.api+json',
        'application/json'
      ].join(','),
      'Content-Type': 'application/json'
    },
    ...options,
  });
};

const suffixes = {
  successSuffix: '_RESOLVED',
  errorSuffix: '_REJECTED',
};

const middlewareOptions = {
  ...suffixes,
  getClientName: action => action.meta.apiRequest.client,
  getRequestConfig: action => action.meta.apiRequest.config,
  getRequestOptions: action => action.meta.apiRequest.options,
  isAxiosRequest: action => action.meta && action.meta.apiRequest,
  returnRejectedPromiseOnError: true,
};

const clientOptions = {
  interceptors: {
    request: [
      ({ getState, getSourceAction }, req) => {
        const reduxAction = getSourceAction(req);
        const apiRequestMeta = reduxAction.meta.apiRequest;
        const authToken = ssoTokenSelector(getState());
        if (authToken && apiRequestMeta.skipAuthHeader !== true) {
          req.headers['Authorization'] = `Bearer ${authToken}`;
        }
        if (apiRequestMeta.minimumDuration) {
          // UX can be improved by adding a minimum duration to some requests.
          // For example displaying a spinner for 20ms can be very jarring,
          // whilst ensuring that it will be displayed for a minimum of 500ms,
          // say, can make the transition appear much smoother.
          //
          // `minimumDurationPromise` is used in a response intercepter to
          // delay the dispatch of the redux action.
          apiRequestMeta.minimumDurationPromise = new Promise(
            resolve => setTimeout(resolve, apiRequestMeta.minimumDuration)
          );
        }
        return req;
      }
    ],
    response: [

      ({ getState, dispatch, getSourceAction }, req) => {
        const reduxAction = getSourceAction(req.config);
        const apiRequestMeta = reduxAction.meta.apiRequest;
        if (apiRequestMeta.minimumDurationPromise) {
          return Promise.all([
            req,
            apiRequestMeta.minimumDurationPromise,
          ])
            .then(r => r[0]);
        }
        return req;
      },

      {
        error: ({ dispatch, getState, getSourceAction }, error) => {
          const response = error.response;
          try {
            const action = getSourceAction(error.config);
            dispatch(requestRejected(action, error, response));
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Error while running error interceptor:', e);
            dispatch(unexpectedError(error, e));
          }
          return Promise.reject(error);
        },
      },
    ],
  },
};

export default createMiddleware();

export function createMiddleware({ axiosClientConfig }={}) {
  return axiosMiddleware(
    makeClient(axiosClientConfig),
    middlewareOptions,
    clientOptions,
  );
}

export function resolved(actionType) {
  return getActionTypes({ type: actionType }, suffixes)[1];
}

export function rejected(actionType) {
  return getActionTypes({ type: actionType }, suffixes)[2];
}
