export const ssoBaseURL = process.env.REACT_APP_SSO_BASE_URL || window.__SSO_BASE_URL__;
export const FLIGHT_APP_URL = process.env.REACT_APP_FLIGHT_APP_URL || (
  typeof window != 'undefined' ? window.__FLIGHT_APP_URL__ : null
);

export default {
  ssoBaseURL,
  FLIGHT_APP_URL,
};
