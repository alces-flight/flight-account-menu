
import { REJECTED, UNEXPECTED_ERROR } from './actionTypes';

export function requestRejected(action, error, response) {
  return {
    type: REJECTED,
    payload: {
      action,
      error,
      response,
    }
  };
}

export function unexpectedError(originalError, error) {
  let errorMessage;
  try { errorMessage = error.toString(); } catch (e) { }
  return {
    type: UNEXPECTED_ERROR,
    payload: {
      error: {
        message: errorMessage,
        ...error,
      },
      originalError,
    },
  };
}
