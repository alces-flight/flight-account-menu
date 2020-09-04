import qs from 'query-string';

export const confirmationState = (state) => state.confirmation;

const tokenFromLocation = (location) => {
  if (location == null) {
    return null;
  }
  return qs.parse(location.search)['confirmation_token'];
};

export function tokenFromUrl(state) {
  if (typeof window === 'undefined') {
    return null;
  }
  return tokenFromLocation(window.location);
}
