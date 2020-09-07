import mkDebug from 'debug';

import * as actions from './actions';
import * as selectors from './selectors';
import { ssoTokenMaturity, ssoTokenExpirationLeaway } from './constants';

const debug = mkDebug('flight-account-menu:auth:logic');
const maxTimeoutDelay = Math.pow(2, 31);

class SessionChecker {
  constructor(timestampField, getTimeoutTime, timestampReachedAction, id) {
    this.timeoutId = undefined;
    this.previousTimestamp = undefined;
    this.timestampField = timestampField;
    this.getTimeoutTime = getTimeoutTime;
    this.timestampReachedAction = timestampReachedAction;
    this.id = id;
  }

  getTimestamp(ssoUser) {
    return ssoUser[this.timestampField];
  }

  onTimestampReached(dispatch, getState) {
    switch (this.timestampReachedAction) {
      case 'confirmPassword':
        this.confirmPassword(dispatch, getState);
        break;

      case 'closeConfirmPassword':
        this.closeConfirmPassword(dispatch, getState);
        break;

      default:
        break;
    }
  }

  confirmPassword(dispatch, getState) {
    const alreadyOpen = selectors.confirmPassword.isModalOpen(getState());
    const manuallyDismissed = selectors.confirmPassword.manuallyDismissed(
      getState()
    );
    const ignore = alreadyOpen || manuallyDismissed;
    if (!ignore) {
      debug('Showing confirm password form');
      dispatch(actions.showConfirmPasswordForm());
    } else {
      debug(
        'Ignoring show confirm password form. alreadyOpen=%s manuallyDismissed=%s',
        alreadyOpen,
        manuallyDismissed
      );
    }
  }

  closeConfirmPassword(dispatch, getState) {
    const isOpen = selectors.confirmPassword.isModalOpen(getState());
    if (isOpen) {
      debug('Hiding confirm password form');
      dispatch(actions.hideConfirmPasswordForm());
    } else {
      debug('Confirm password form already closed.');
    }
  }

  check(dispatch, getState) {
    const ssoUser = selectors.currentUserSelector(getState());
    const expired = selectors.ssoTokenExpired(getState());
    debug('Running %s checker: ssoUser=%O expired=%s', this.id, ssoUser, expired);
    if (ssoUser == null || expired) {
      if (this.timeoutId != null) {
        debug('Clearing timeout, %d', this.timeoutId);
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
      this.closeConfirmPassword(dispatch, getState);
      return;
    }

    const currentTimestamp = this.getTimestamp(ssoUser);
    if (currentTimestamp === this.previousTimestamp && this.timeoutId != null) {
      // Nothing to do. We have a timeout for the correct time.
      debug('Current timeout is correct');
      return;
    }
    if (this.timeoutId != null) {
      debug('Clearing old timeout');
      clearTimeout(this.timeoutId);
    }
    const delay = this.clampTimeout(this.getTimeoutTime(ssoUser));
    this.setTimeout(dispatch, getState, ssoUser, delay);
    this.previousTimestamp = currentTimestamp;
  }

  clampTimeout(delay) {
    // Some browsers don't like having a timeout more than 2^31 milliseconds
    // into the future.
    if (delay >= maxTimeoutDelay) {
      debug('Clamping timeout to %d', maxTimeoutDelay);
      return maxTimeoutDelay - 1
    } else {
      return delay;
    }
  }

  setTimeout(dispatch, getState, ssoUser, delay) {
    debug('Setting new timeout to activate in %d', delay);
    this.timeoutId = setTimeout(
      () => {
        debug(
          'Timeout reached for %s checker. Running action %s',
          this.id,
          this.timestampReachedAction,
        );
        this.onTimestampReached(dispatch, getState);
        this.timeoutId = undefined;
      },
      delay
    );
  }
}

function timeUntilTokenIsMature(ssoUser) {
  const now = new Date().getTime() / 1000;
  if (ssoUser.iat == null) {
    return 0;
  } else if (ssoUser.iat + ssoTokenMaturity < now) {
    return 0;
  } else {
    return (ssoUser.iat + ssoTokenMaturity - now) * 1000;
  }
}

function timeUntilTokenAboutToExpire(ssoUser) {
  const now = new Date().getTime() / 1000;
  if (ssoUser.exp - ssoTokenExpirationLeaway <= now) {
    return 0;
  } else {
    return (ssoUser.exp - ssoTokenExpirationLeaway - now) * 1000;
  }
}

function timeUntilTokenExpired(ssoUser) {
  const now = new Date().getTime() / 1000;
  if (ssoUser.exp <= now) {
    return 0;
  } else {
    return (ssoUser.exp - now) * 1000;
  }
}

const expiringChecker = new SessionChecker(
  'exp',
  timeUntilTokenAboutToExpire,
  'confirmPassword',
  'expiring',
);
const expiredChecker = new SessionChecker(
  'exp',
  timeUntilTokenExpired,
  'closeConfirmPassword',
  'expired',
);
const maturityChecker = new SessionChecker(
  'iat',
  timeUntilTokenIsMature,
  'confirmPassword',
  'maturity'
);

export function checkSessionExpiration(dispatch, getState) {
  expiringChecker.check(dispatch, getState);
  expiredChecker.check(dispatch, getState);
}

export function checkSessionMaturity(dispatch, getState) {
  maturityChecker.check(dispatch, getState);
  expiredChecker.check(dispatch, getState);
}

let previousCurrentUser = {};
let initialChangeSeen = false;
export function whenAuthChanges(callback, { includeInitial=true }) {
  return function(dispatch, getState) {
    const currentUser = selectors.currentUserSelector(getState());
    if (currentUser !== previousCurrentUser) {
      previousCurrentUser = currentUser;
      if (includeInitial || initialChangeSeen) {
        callback(currentUser, dispatch, getState);
      }
      initialChangeSeen = true;
    }
  };
}
