/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Reactware.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import lodash from 'lodash';

import { PENDING, RESOLVED, REJECTED } from './constants';

const initialState = {};

function getLoadingStateKey(actionMeta) {
  return lodash.get(actionMeta, 'previousAction.meta.loadingState.key') ||
    lodash.get(actionMeta, 'loadingState.key');
}

const setLoadingState = (actionMeta, loadingState) => state => {
  const key = getLoadingStateKey(actionMeta);
  return {
    ...state,
    [key]: {
      self: {
        state: loadingState,
      }
    }
  };
};

// Reducer to track the loading state of entities.
export default function reducer(config) {
  return function(state = initialState, { meta, type }) {
    switch (type) {
      case config.pending:
        return setLoadingState(meta, PENDING)(state);

      case config.resolved:
        return setLoadingState(meta, RESOLVED)(state);

      case config.rejected:
        return setLoadingState(meta, REJECTED)(state);

      default:
        return state;
    }
  };
}
