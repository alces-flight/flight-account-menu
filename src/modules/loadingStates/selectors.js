/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Reactware.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import lodash from 'lodash';

import { NAME, PENDING, RESOLVED, REJECTED } from './constants';

const loadingStateForKey = (state, key) => (
  lodash.get(state, ['meta', NAME, key, 'self']) || {}
);

const relationLoadingState = (state, parentKey, relationName) => (
  lodash.get(state, ['meta', NAME, parentKey, 'relationships', relationName, 'related']) || {}
);

const relationSelfLoadingState = (state, parentKey, relationName) => (
  lodash.get(state, ['meta', NAME, parentKey, 'relationships', relationName, 'self']) || {}
);

export const retrieval = (state, key) => {
  const loadingState = loadingStateForKey(state, key);
  return {
    hasEverResolved: loadingState.hasEverResolved,
    initiated: [PENDING, RESOLVED, REJECTED].includes(loadingState.state),
    pending: loadingState.state === PENDING,
    resolved: loadingState.state === RESOLVED,
    rejected: loadingState.state === REJECTED,
  };
};

export const relationshipRetrieval = (state, parentKey, relationName) => {
  const relatedLoadingState = relationLoadingState(state, parentKey, relationName);
  const selfLoadingState = relationSelfLoadingState(state, parentKey, relationName);

  const initiated = (
    [PENDING, RESOLVED, REJECTED].includes(relatedLoadingState.state) ||
    [PENDING, RESOLVED, REJECTED].includes(selfLoadingState.state)
  );
  const resolved = relatedLoadingState.state === RESOLVED &&
    selfLoadingState.state === RESOLVED;
  const rejected = relatedLoadingState.state === REJECTED ||
    selfLoadingState.state === REJECTED;
  const pending = initiated && !(resolved || rejected);
  const hasEverResolved = relatedLoadingState.hasEverResolved &&
    selfLoadingState.hasEverResolved;

  return {
    hasEverResolved,
    initiated,
    pending,
    resolved,
    rejected,
  };
};
