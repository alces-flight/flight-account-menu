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

import { static as Immutable } from 'seamless-immutable';
import lodash from 'lodash';

import { RELATIONS_REMOVED } from './actionTypes';

const get = lodash.get;

export function entitiesFromJsonApiResponse(response) {
  const entities = Immutable.from(
    Array.isArray(response.data) ? response.data : [response.data],
  ).concat(response.included || []);

  return entities;
}

export function entityFromActionPayload(payload) {
  return Immutable.from({ type: payload.data.type, id: payload.data.id });
}

export function entityFromResolvedRequest(meta) {
  const entity = meta.previousAction.meta.entity;
  return Immutable.from(entity);
}

export function buildLinksData(payload, meta) {
  return { [meta.previousAction.meta.relationName]: payload.data };
}

export function getClientMeta(entity) {
  return get(entity, 'meta.client') || {};
}

export function incorrectError(response, errorAction) {
  const errors = response && response.data && response.data.errors;

  if (response.status === 400 && errors[0].code === 'RELATION_EXISTS') {
    // We've tried to add a relation but the relation already exists.  The
    // JSONAPI standard states that this shouldn't be an error.
    // Unfortunately, jsonapi-resources disagrees.
    return true;
  }

  if (response.status === 404) {
    // An incorrect 404 response could be given if an attempt is made to
    // delete a to-many relationship that hasn't been added. The JSONAPI
    // standard states that this shouldn't be an error.  Unfortunately,
    // jsonapi-resources disagrees.
    //
    // There is some awkwardness in detecting that this is the case, as when
    // called from apiRequestMiddleware we do not have access to the
    // errorAction object and so cannot obtain the previous redux action that
    // started the request.  We can make a best guess by inspecting the
    // reponse's request config.
    const previousActionType = errorAction && errorAction.meta.previousAction.type;
    if (previousActionType === RELATIONS_REMOVED) {
      return true;
    }
    const requestConfig = response.config;
    if (requestConfig.method === 'delete' &&
        requestConfig.url.match(/\/relationships\//)) {
      return true;
    }
  }

  return false;
}
