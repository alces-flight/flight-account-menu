/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

/*=============================================================================
 * Based on code taken from
 * https://github.com/dixieio/redux-json-api/blob/master/src/reducer.js
 * under the MIT license.
 * https://github.com/dixieio/redux-json-api/blob/master/package.json
 *===========================================================================*/

import apiRequest from '../../modules/apiRequest';

import { incorrectError } from '../jsonApi/utils';
import { getActionTypes } from 'redux-axios-middleware';

export function maybeThrowSubmissionError(errorAction) {
  const response = errorAction.error.response;
  const jsonApiErrors = response && response.data && response.data.errors;
  if (!jsonApiErrors) {
    return jsonApiErrors;
  }

  if (incorrectError(response, errorAction)) {
    // jsonapi-resources can sometimes return an error response when it really
    // shouldn't.  Such as complaining about adding a relation that has
    // already been added.  In such cases we want to make sure that we don't
    // return a rejected promise.
    return jsonApiErrors;
  }

  let formattedErrors;

  if (Array.isArray(jsonApiErrors)) {
    formattedErrors = jsonApiErrors.reduce((accum, errorObject) => {
      if (!errorObject.source || !errorObject.source.pointer) {
        // Without a source pointer, we're not going to be able to determine
        // which attribute this error belongs to.  It could be a 500 error or
        // some such.
        return accum;
      }
      const sourcePaths = errorObject.source.pointer.split('/');
      const attributeName = sourcePaths[sourcePaths.length - 1];
      // eslint-disable-next-line no-param-reassign
      accum[attributeName] = accum[attributeName] || [];
      accum[attributeName].push(errorObject.title);
      return accum;
    }, {});
  }
  else {
    // We likely have an object that already gives us the mapping we need
    formattedErrors = jsonApiErrors;
  }

  throw new apiRequest.SubmissionError(formattedErrors);
}

export const notFoundError = {
  data: {
    errors: [{
      status: 404,
      title: 'Record not found',
      code: 'RECORD_NOT_FOUND',
    }],
  },
  status: 404
};

export function responseHasOneRecord(response) {
  const entities = response.data.data;
  if (entities == null) {
    return false;
  }
  if (Array.isArray(entities) && (entities.length < 1 || entities > 1)) {
    return false;
  }
  return true;
}

// Factory returning an onSuccess callback for use with
// redux-axios-middleware.
//
// If `predicate(response)` passes, the default resolved action is returned.
// Otherwise the default rejected action is returned with given error object.
export function rejectWithUnless(errorObject, predicate) {
  return ({ action, next, response }, options) => {
    let nextAction;
    if (predicate(response)) {
      nextAction = {
        type: getActionTypes(action, options)[1],
        payload: response,
        meta: {
          previousAction: action
        }
      };
    } else {
      nextAction = {
        type: getActionTypes(action, options)[2],
        error: errorObject,
        meta: {
          previousAction: action
        }
      };
    }
    next(nextAction);
    return nextAction;
  };
}
