export const NAME = 'auth';
export const FLIGHT_SSO_COOKIE = process.env.REACT_APP_SSO_COOKIE_NAME ||
  window.__SSO_COOKIE_NAME__ ||
  'flight_sso';

export const signOnStates = {
  NOT_STARTED: 1,
  FORM_SHOWING: 2,
  SUBMITTING: 3,
  SIGN_ON_FAILED: 4
};

// The age at which an SSO token is considered to have matured or become old.
export const ssoTokenMaturity = process.env.REACT_APP_SSO_TOKEN_MATURITY ||
  24 * 60 * 60; // 24 hours;

export const ssoTokenExpirationLeaway = process.env.REACT_APP_SSO_TOKEN_EXPIRATION_LEAWAY ||
  5 * 60; // 5 minutes.
